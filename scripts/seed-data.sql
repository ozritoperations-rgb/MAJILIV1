-- Seed Data for MAJILIS Intelligence Platform Demo
-- This script creates test users and sample workflow data for client presentation

-- Create test users in auth.users (manual step - these emails can be used to sign up)
-- Users to create:
-- 1. admin@majilis.kz (Administrator)
-- 2. analyst@majilis.kz (Analyst)
-- 3. member@majilis.kz (Parliament Member)

-- Insert sample documents (use actual user IDs after signup)
-- Note: Replace the user_id values with actual UUIDs after creating test accounts

-- Sample Documents
INSERT INTO documents (title, description, file_path, file_type, file_size, status, uploaded_by)
VALUES
  ('National Budget Reform Bill 2026', 'Comprehensive analysis of proposed fiscal reforms and budget allocation strategies for the upcoming fiscal year', '/docs/budget-reform-2026.pdf', 'application/pdf', 2457600, 'processed', (SELECT id FROM auth.users WHERE email = 'admin@majilis.kz' LIMIT 1)),
  ('Healthcare Modernization Act', 'Legislation proposal for modernizing healthcare infrastructure and expanding public health services across all regions', '/docs/healthcare-act.pdf', 'application/pdf', 1843200, 'processed', (SELECT id FROM auth.users WHERE email = 'analyst@majilis.kz' LIMIT 1)),
  ('Digital Transformation Strategy', 'Framework for implementing digital government services and e-governance initiatives', '/docs/digital-strategy.pdf', 'application/pdf', 3145728, 'processed', (SELECT id FROM auth.users WHERE email = 'member@majilis.kz' LIMIT 1)),
  ('Education Sector Development Plan', 'Long-term strategic plan for improving education quality and accessibility', '/docs/education-plan.pdf', 'application/pdf', 2097152, 'processing', (SELECT id FROM auth.users WHERE email = 'admin@majilis.kz' LIMIT 1)),
  ('Environmental Protection Amendment', 'Proposed amendments to strengthen environmental regulations and sustainability measures', '/docs/env-amendment.pdf', 'application/pdf', 1572864, 'processed', (SELECT id FROM auth.users WHERE email = 'analyst@majilis.kz' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Sample Tasks
INSERT INTO tasks (title, description, priority, status, due_date, created_by, assigned_to)
VALUES
  ('Review Budget Committee Report', 'Analyze the quarterly budget committee findings and prepare summary for parliamentary session', 'high', 'in_progress', CURRENT_DATE + INTERVAL '5 days', (SELECT id FROM auth.users WHERE email = 'admin@majilis.kz' LIMIT 1), (SELECT id FROM auth.users WHERE email = 'analyst@majilis.kz' LIMIT 1)),
  ('Draft Healthcare Policy Brief', 'Prepare comprehensive policy brief on healthcare modernization proposals', 'urgent', 'pending', CURRENT_DATE + INTERVAL '3 days', (SELECT id FROM auth.users WHERE email = 'member@majilis.kz' LIMIT 1), (SELECT id FROM auth.users WHERE email = 'analyst@majilis.kz' LIMIT 1)),
  ('Stakeholder Consultation Meeting', 'Coordinate with ministry representatives for digital transformation feedback', 'medium', 'pending', CURRENT_DATE + INTERVAL '7 days', (SELECT id FROM auth.users WHERE email = 'admin@majilis.kz' LIMIT 1), (SELECT id FROM auth.users WHERE email = 'member@majilis.kz' LIMIT 1)),
  ('Legal Compliance Audit', 'Conduct comprehensive audit of new legislation for constitutional compliance', 'high', 'in_progress', CURRENT_DATE + INTERVAL '10 days', (SELECT id FROM auth.users WHERE email = 'analyst@majilis.kz' LIMIT 1), (SELECT id FROM auth.users WHERE email = 'admin@majilis.kz' LIMIT 1)),
  ('Public Hearing Preparation', 'Organize materials and documentation for upcoming public consultation session', 'medium', 'completed', CURRENT_DATE - INTERVAL '2 days', (SELECT id FROM auth.users WHERE email = 'member@majilis.kz' LIMIT 1), (SELECT id FROM auth.users WHERE email = 'analyst@majilis.kz' LIMIT 1)),
  ('Research Economic Impact', 'Analyze economic implications of proposed tax reform legislation', 'low', 'pending', CURRENT_DATE + INTERVAL '14 days', (SELECT id FROM auth.users WHERE email = 'analyst@majilis.kz' LIMIT 1), (SELECT id FROM auth.users WHERE email = 'analyst@majilis.kz' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Sample Notifications
INSERT INTO notifications (user_id, title, message, type, read)
VALUES
  ((SELECT id FROM auth.users WHERE email = 'admin@majilis.kz' LIMIT 1), 'Document Processed', 'Budget Reform Bill 2026 has been successfully analyzed by AI', 'success', false),
  ((SELECT id FROM auth.users WHERE email = 'admin@majilis.kz' LIMIT 1), 'New Task Assigned', 'You have been assigned: Legal Compliance Audit', 'info', false),
  ((SELECT id FROM auth.users WHERE email = 'analyst@majilis.kz' LIMIT 1), 'Task Due Soon', 'Healthcare Policy Brief is due in 3 days', 'warning', false),
  ((SELECT id FROM auth.users WHERE email = 'analyst@majilis.kz' LIMIT 1), 'Document Ready', 'Healthcare Modernization Act analysis complete', 'success', true),
  ((SELECT id FROM auth.users WHERE email = 'member@majilis.kz' LIMIT 1), 'Meeting Reminder', 'Stakeholder consultation scheduled for next week', 'info', false),
  ((SELECT id FROM auth.users WHERE email = 'member@majilis.kz' LIMIT 1), 'AI Insight Available', 'New insights extracted from Digital Transformation Strategy', 'success', false)
ON CONFLICT DO NOTHING;

-- Sample Document Insights (AI-generated analysis)
INSERT INTO document_insights (document_id, insight_type, content, confidence_score)
VALUES
  ((SELECT id FROM documents WHERE title = 'National Budget Reform Bill 2026' LIMIT 1), 'summary', 'This bill proposes a 12% increase in social welfare spending while introducing new efficiency measures in government operations. Key focus areas include healthcare, education, and infrastructure development with projected economic growth impact of 3.5% over next 3 years.', 0.92),
  ((SELECT id FROM documents WHERE title = 'National Budget Reform Bill 2026' LIMIT 1), 'key_point', 'Allocation of 450 billion KZT for healthcare infrastructure modernization', 0.88),
  ((SELECT id FROM documents WHERE title = 'National Budget Reform Bill 2026' LIMIT 1), 'key_point', 'Implementation of digital budget tracking system for transparency', 0.85),
  ((SELECT id FROM documents WHERE title = 'Healthcare Modernization Act' LIMIT 1), 'summary', 'Comprehensive healthcare reform focusing on rural area accessibility, medical equipment upgrades, and telemedicine integration. Includes provisions for training 5,000 additional healthcare workers over 5 years.', 0.90),
  ((SELECT id FROM documents WHERE title = 'Healthcare Modernization Act' LIMIT 1), 'risk', 'Budget implementation timeline may face delays due to procurement processes', 0.76),
  ((SELECT id FROM documents WHERE title = 'Digital Transformation Strategy' LIMIT 1), 'summary', 'Strategic roadmap for digitizing 80% of government services by 2028. Emphasizes cybersecurity, data protection, and citizen-centric digital platforms.', 0.94),
  ((SELECT id FROM documents WHERE title = 'Digital Transformation Strategy' LIMIT 1), 'recommendation', 'Prioritize mobile-first approach for maximum citizen accessibility', 0.82),
  ((SELECT id FROM documents WHERE title = 'Environmental Protection Amendment' LIMIT 1), 'summary', 'Strengthens environmental impact assessment requirements and introduces stricter penalties for violations. Promotes renewable energy transition with tax incentives.', 0.89)
ON CONFLICT DO NOTHING;
