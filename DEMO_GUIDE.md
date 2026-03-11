# MAJILIS Intelligence Platform - Demo Guide

## Overview
The MAJILIS Intelligence Platform is a comprehensive parliamentary intelligence system featuring document analysis, task management, and AI-powered insights for legislative work.

## Key Features

### 1. AI Chat Assistant
- **Location**: Floating blue button in bottom-right corner
- **Functionality**:
  - Click the robot icon to open the AI assistant
  - Ask questions about parliamentary documents
  - Get AI-generated insights and analysis
  - Interactive chat interface with message history

### 2. Document Management
- **Upload & Process**: Upload parliamentary documents (PDF format)
- **AI Analysis**: Automatic document processing with AI-generated summaries
- **Status Tracking**: Monitor processing status (Processing, Processed, Failed)
- **Categories**: Law Proposals, Reports, Memos
- **Demo Data**: 5 sample documents with AI summaries included

### 3. Task Management
- **Create Tasks**: Define tasks with title, description, priority, and due dates
- **Priority Levels**: Low, Medium, High, Urgent (color-coded)
- **Status Workflow**:
  - Pending → In Progress → Completed
  - Visual status indicators with badges
- **Actions**: Start tasks, mark as complete
- **Demo Data**: 6 sample tasks showing various states

### 4. Notifications System
- **Real-time Updates**: Bell icon in header shows unread count
- **Notification Types**: Success, Info, Warning
- **Mark as Read**: Click notifications to mark them as read
- **Demo Data**: 6 sample notifications included

## Demo Workflow

### First Time Setup

1. **Sign Up**
   - Use one of these test emails:
     - admin@majilis.kz (Administrator role)
     - analyst@majilis.kz (Analyst role)
     - member@majilis.kz (Parliament Member role)
   - Choose any password (minimum 6 characters)

2. **Automatic Demo Data**
   - After signup, demo data is automatically loaded
   - Includes documents, tasks, and notifications
   - Ready for immediate demonstration

### Demonstration Flow

#### Step 1: Dashboard Overview (Documents Tab)
1. Show the clean, professional interface
2. Review the 5 sample documents:
   - National Budget Reform Bill 2026
   - Healthcare Modernization Act
   - Digital Transformation Strategy
   - Education Sector Development Plan (Processing)
   - Environmental Protection Amendment

3. Click on documents to see:
   - Document metadata (category, file size, date)
   - AI-generated summaries
   - Processing status badges

#### Step 2: AI Chat Assistant
1. Click the blue robot button (bottom-right)
2. The chat window opens with a welcome message
3. Type questions like:
   - "Summarize the budget reform bill"
   - "What are the key points in healthcare legislation?"
   - "Analyze the digital transformation strategy"
4. AI responds with relevant parliamentary insights
5. Show the smooth chat interface and typing indicators

#### Step 3: Task Management
1. Switch to "Tasks" tab
2. Show the 6 sample tasks with different priorities:
   - Urgent: Draft Healthcare Policy Brief (due in 3 days)
   - High: Review Budget Committee Report, Legal Compliance Audit
   - Medium: Stakeholder Meeting, Public Hearing (completed)
   - Low: Research Economic Impact

3. Demonstrate task actions:
   - "Start Task" for pending tasks
   - "Complete Task" for in-progress tasks
   - Show color-coded priority badges

#### Step 4: Create New Task
1. Use the "Create Task" panel on the right
2. Fill in:
   - Title: "Prepare Q2 Parliamentary Session"
   - Description: "Compile agenda and briefing materials"
   - Priority: High
   - Due Date: [Select future date]
3. Click "Create Task"
4. New task appears instantly in the list

#### Step 5: Notifications
1. Click the bell icon in header (shows unread count)
2. Review notifications:
   - Document processing completions
   - Task assignments
   - Due date reminders
3. Click a notification to mark as read
4. Badge count updates automatically

#### Step 6: Document Upload
1. Use the "Upload Document" panel
2. Select a PDF file
3. Add title and description
4. Choose category
5. Upload and show processing status

## Technical Highlights

### Security Features
- Row Level Security (RLS) on all database tables
- Authenticated user access only
- Secure API endpoints
- Environment variable protection

### AI Integration
- OZRTI AI Chat Bot powered system
- N8N workflow integration
- Real-time document processing
- Intelligent insights extraction

### User Experience
- Responsive design (mobile to desktop)
- Smooth animations and transitions
- Color-coded status indicators
- Intuitive navigation
- Real-time updates

### Architecture
- React frontend with TypeScript
- Supabase backend (PostgreSQL)
- Edge Functions for serverless processing
- RESTful API design

## Color Coding Reference

### Priority Levels
- **Red**: Urgent
- **Orange**: High
- **Blue**: Medium
- **Gray**: Low

### Document Status
- **Green**: Processed
- **Orange**: Processing
- **Red**: Failed

### Task Status
- **Green**: Completed
- **Blue**: In Progress
- **Orange**: Pending

### Notification Types
- **Green**: Success
- **Blue**: Info
- **Orange**: Warning

## Best Practices for Demo

1. **Start with Overview**: Show the dashboard first
2. **Highlight AI**: Open chatbot early to impress
3. **Show Workflow**: Demonstrate complete task lifecycle
4. **Interactive**: Create a task or upload document live
5. **Professional**: Emphasize clean UI and smooth interactions
6. **Technical Depth**: Mention security and architecture if asked

## Troubleshooting

### No Demo Data Showing
- Ensure you're signed in with a new account
- Refresh the page after signup
- Demo data loads automatically for new users

### Chat Not Responding
- Check internet connection
- Responses are simulated for demo (1.5 second delay)
- Real integration requires API configuration

### Upload Not Working
- Ensure file is PDF format
- Check file size (under 10MB recommended)
- Verify you're signed in

## Production Deployment Notes

For actual deployment, configure:
1. Real AI API endpoints (OZRTI integration)
2. File storage bucket in Supabase
3. N8N workflow webhooks
4. Email notification service
5. Production environment variables
6. Custom domain and SSL

---

**For Questions or Support**: Contact the development team
**Version**: 1.0.0
**Last Updated**: March 11, 2026
