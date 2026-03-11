/*
  # Add Demo Seed Data

  1. Sample Data Creation
    - Inserts sample documents for demonstration
    - Inserts sample tasks with various statuses and priorities
    - Inserts sample notifications
    - Adds AI summaries to processed documents

  2. Purpose
    - Provides realistic demo data for client presentation
    - Shows complete workflow from document upload to AI analysis
    - Demonstrates task management and notification system
    - All data is safe to add (uses conditional logic)

  3. Notes
    - Uses the authenticated user's ID for ownership
    - Creates a complete workflow scenario
    - All timestamps are relative to current date for relevance
*/

-- Insert sample documents only if none exist
DO $$
DECLARE
  v_user_id uuid;
  v_doc_count integer;
BEGIN
  -- Get the current user's ID (from auth context)
  v_user_id := auth.uid();

  -- Only insert if user is authenticated and no documents exist
  IF v_user_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_doc_count FROM documents WHERE uploaded_by = v_user_id;

    IF v_doc_count = 0 THEN
      INSERT INTO documents (title, description, file_path, file_type, file_size, status, uploaded_by, category)
      VALUES
        ('National Budget Reform Bill 2026', 'Comprehensive analysis of proposed fiscal reforms and budget allocation strategies for the upcoming fiscal year', '/docs/budget-reform-2026.pdf', 'application/pdf', 2457600, 'processed', v_user_id, 'law_proposal'),
        ('Healthcare Modernization Act', 'Legislation proposal for modernizing healthcare infrastructure and expanding public health services across all regions', '/docs/healthcare-act.pdf', 'application/pdf', 1843200, 'processed', v_user_id, 'law_proposal'),
        ('Digital Transformation Strategy', 'Framework for implementing digital government services and e-governance initiatives', '/docs/digital-strategy.pdf', 'application/pdf', 3145728, 'processed', v_user_id, 'report'),
        ('Education Sector Development Plan', 'Long-term strategic plan for improving education quality and accessibility', '/docs/education-plan.pdf', 'application/pdf', 2097152, 'processing', v_user_id, 'report'),
        ('Environmental Protection Amendment', 'Proposed amendments to strengthen environmental regulations and sustainability measures', '/docs/env-amendment.pdf', 'application/pdf', 1572864, 'processed', v_user_id, 'law_proposal');
    END IF;
  END IF;
END $$;

-- Insert sample tasks only if none exist
DO $$
DECLARE
  v_user_id uuid;
  v_task_count integer;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_task_count FROM tasks WHERE created_by = v_user_id;

    IF v_task_count = 0 THEN
      INSERT INTO tasks (title, description, priority, status, due_date, created_by, assigned_to)
      VALUES
        ('Review Budget Committee Report', 'Analyze the quarterly budget committee findings and prepare summary for parliamentary session', 'high', 'in_progress', CURRENT_DATE + INTERVAL '5 days', v_user_id, v_user_id),
        ('Draft Healthcare Policy Brief', 'Prepare comprehensive policy brief on healthcare modernization proposals', 'urgent', 'pending', CURRENT_DATE + INTERVAL '3 days', v_user_id, v_user_id),
        ('Stakeholder Consultation Meeting', 'Coordinate with ministry representatives for digital transformation feedback', 'medium', 'pending', CURRENT_DATE + INTERVAL '7 days', v_user_id, v_user_id),
        ('Legal Compliance Audit', 'Conduct comprehensive audit of new legislation for constitutional compliance', 'high', 'in_progress', CURRENT_DATE + INTERVAL '10 days', v_user_id, v_user_id),
        ('Public Hearing Preparation', 'Organize materials and documentation for upcoming public consultation session', 'medium', 'completed', CURRENT_DATE - INTERVAL '2 days', v_user_id, v_user_id),
        ('Research Economic Impact', 'Analyze economic implications of proposed tax reform legislation', 'low', 'pending', CURRENT_DATE + INTERVAL '14 days', v_user_id, v_user_id);
    END IF;
  END IF;
END $$;

-- Insert sample notifications only if none exist
DO $$
DECLARE
  v_user_id uuid;
  v_notif_count integer;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_notif_count FROM notifications WHERE user_id = v_user_id;

    IF v_notif_count = 0 THEN
      INSERT INTO notifications (user_id, title, message, type, read)
      VALUES
        (v_user_id, 'Document Processed', 'Budget Reform Bill 2026 has been successfully analyzed by AI', 'success', false),
        (v_user_id, 'New Task Assigned', 'You have been assigned: Legal Compliance Audit', 'info', false),
        (v_user_id, 'Task Due Soon', 'Healthcare Policy Brief is due in 3 days', 'warning', false),
        (v_user_id, 'Document Ready', 'Healthcare Modernization Act analysis complete', 'success', true),
        (v_user_id, 'Meeting Reminder', 'Stakeholder consultation scheduled for next week', 'info', false),
        (v_user_id, 'AI Insight Available', 'New insights extracted from Digital Transformation Strategy', 'success', false);
    END IF;
  END IF;
END $$;

-- Add AI summaries to processed documents
DO $$
DECLARE
  v_user_id uuid;
  v_doc_id uuid;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NOT NULL THEN
    -- Update Budget Reform Bill
    SELECT id INTO v_doc_id FROM documents WHERE title = 'National Budget Reform Bill 2026' AND uploaded_by = v_user_id LIMIT 1;
    IF v_doc_id IS NOT NULL THEN
      UPDATE documents
      SET ai_summary = 'This bill proposes a 12% increase in social welfare spending while introducing new efficiency measures in government operations. Key focus areas include healthcare, education, and infrastructure development with projected economic growth impact of 3.5% over next 3 years. Budget allocation: 450 billion KZT for healthcare infrastructure, 320 billion KZT for education modernization, and 280 billion KZT for digital infrastructure.'
      WHERE id = v_doc_id AND ai_summary IS NULL;
    END IF;

    -- Update Healthcare Act
    SELECT id INTO v_doc_id FROM documents WHERE title = 'Healthcare Modernization Act' AND uploaded_by = v_user_id LIMIT 1;
    IF v_doc_id IS NOT NULL THEN
      UPDATE documents
      SET ai_summary = 'Comprehensive healthcare reform focusing on rural area accessibility, medical equipment upgrades, and telemedicine integration. Includes provisions for training 5,000 additional healthcare workers over 5 years. Implementation timeline: Phase 1 (2026-2027) infrastructure upgrades, Phase 2 (2027-2029) workforce expansion, Phase 3 (2029-2031) digital health integration.'
      WHERE id = v_doc_id AND ai_summary IS NULL;
    END IF;

    -- Update Digital Transformation Strategy
    SELECT id INTO v_doc_id FROM documents WHERE title = 'Digital Transformation Strategy' AND uploaded_by = v_user_id LIMIT 1;
    IF v_doc_id IS NOT NULL THEN
      UPDATE documents
      SET ai_summary = 'Strategic roadmap for digitizing 80% of government services by 2028. Emphasizes cybersecurity, data protection, and citizen-centric digital platforms. Key initiatives include: mobile-first government portal, blockchain-based document verification, AI-powered citizen support system, and open data platform for transparency.'
      WHERE id = v_doc_id AND ai_summary IS NULL;
    END IF;

    -- Update Environmental Protection Amendment
    SELECT id INTO v_doc_id FROM documents WHERE title = 'Environmental Protection Amendment' AND uploaded_by = v_user_id LIMIT 1;
    IF v_doc_id IS NOT NULL THEN
      UPDATE documents
      SET ai_summary = 'Strengthens environmental impact assessment requirements and introduces stricter penalties for violations. Promotes renewable energy transition with tax incentives. Targets: 40% renewable energy by 2030, 50% reduction in carbon emissions by 2035, mandatory environmental audits for all major projects.'
      WHERE id = v_doc_id AND ai_summary IS NULL;
    END IF;
  END IF;
END $$;
