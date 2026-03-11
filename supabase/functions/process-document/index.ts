import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ProcessDocumentRequest {
  documentId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { documentId }: ProcessDocumentRequest = await req.json();

    if (!documentId) {
      return new Response(
        JSON.stringify({ error: "documentId is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .maybeSingle();

    if (fetchError || !document) {
      return new Response(
        JSON.stringify({ error: "Document not found" }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    await supabase
      .from("documents")
      .update({ status: "processing" })
      .eq("id", documentId);

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      await supabase
        .from("documents")
        .update({ status: "failed" })
        .eq("id", documentId);

      return new Response(
        JSON.stringify({
          error: "OPENAI_API_KEY not configured"
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    let ocrText = "";
    let aiSummary = "";

    try {
      const fileResponse = await fetch(document.file_url);

      if (!fileResponse.ok) {
        throw new Error("Failed to fetch document file");
      }

      const fileBlob = await fileResponse.blob();

      if (document.file_type === "application/pdf") {
        ocrText = `[PDF Processing - Content extraction would be implemented here for: ${document.title}]`;
      } else if (document.file_type.startsWith("image/")) {
        ocrText = `[Image OCR - Text extraction would be implemented here for: ${document.title}]`;
      } else {
        ocrText = `[Document type ${document.file_type} - Processing not yet implemented]`;
      }

      const summaryPrompt = `Please analyze this parliamentary document and provide a concise summary:

Title: ${document.title}
Category: ${document.category}
Description: ${document.description || "No description provided"}

Content: ${ocrText}

Provide a structured summary including:
1. Main topic
2. Key points
3. Recommended actions (if any)`;

      const summaryResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an AI assistant helping parliamentary staff analyze documents. Provide clear, structured summaries."
            },
            {
              role: "user",
              content: summaryPrompt
            }
          ],
          max_tokens: 500,
          temperature: 0.3,
        }),
      });

      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        aiSummary = summaryData.choices?.[0]?.message?.content || "Summary generation failed";
      } else {
        aiSummary = "Failed to generate AI summary";
      }

    } catch (processingError) {
      console.error("Document processing error:", processingError);
      ocrText = "Error during text extraction";
      aiSummary = "Error during summary generation";
    }

    const { error: updateError } = await supabase
      .from("documents")
      .update({
        status: "completed",
        ocr_text: ocrText,
        ai_summary: aiSummary,
        updated_at: new Date().toISOString(),
      })
      .eq("id", documentId);

    if (updateError) {
      console.error("Error updating document:", updateError);
    }

    if (document.uploaded_by) {
      await supabase
        .from("notifications")
        .insert({
          user_id: document.uploaded_by,
          title: "Document Processed",
          message: `Your document "${document.title}" has been processed and analyzed.`,
          type: "document_processed",
          metadata: { document_id: documentId },
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        document: {
          id: documentId,
          status: "completed",
          ocr_text: ocrText,
          ai_summary: aiSummary,
        },
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in process-document function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
