- [x] Create a PROFILE_REQUIREMENTS config array with all profile steps (Join Telegram, Follow Twitter, Connect ORCID, Connect OCID, Connect Wallet), each with a required flag and relevant link.
- [x] Implement a utility function to check if a user's profile meets all required fields from PROFILE_REQUIREMENTS.
- [x] On wallet connect, fetch user profile from backend and check profile completion using the utility function.
- [x] If profile is incomplete, block access to all pages except /settings/profile and show a message: 'Please complete your profile to use Mintellect. Finish the steps below to unlock the full app experience.'
- [x] Redirect users with incomplete profiles to /settings/profile if they try to access any other page.
- [x] Render a checklist UI in /settings/profile showing all required steps, with links/buttons for each action (Telegram, Twitter, ORCID, OCID, Wallet).
- [x] Allow easy manual editing of the required/not required status for each profile field in the PROFILE_REQUIREMENTS config.
- [x] Ensure the logic works for both new users (no profile yet) and existing users (profile fetched on wallet connect).
- [x] Test the flow for both new and existing users, including edge cases (e.g., user disconnects wallet, partial completion, etc.).

---

## Document Workflow TODO

- [x] Update FileUpload to accept .doc, .docx, .txt (and .tex later)
- [x] Only allow one file per submission for simplicity
- [x] Implement basic eligibility check (JS):
    - [x] Minimum word count (e.g., >200 words)
    - [x] Presence of title (first line or "Title:")
    - [x] Paragraph structure (multiple paragraphs)
- [x] Optionally: Integrate Gemini 2.5 Flash API for document classification (academic/research vs. random text)
    - [x] Block non-academic documents from proceeding
    - [x] Show feedback if not eligible
- [x] If eligible, send file to FastAPI plagiarism server
    - [x] Show progress and display results
- [x] After plagiarism check, send full document to Gemini 2.5 flash for human-to-AI percent analysis
    - [x] Display trust score to user
    - [x] Optionally highlight AI-generated sections
- [x] Add review step (optional human review)
- [x] Add NFT minting step for eligible documents

### Workflow Context & Persistence
- [x] Frontend: Store workflow state (step, document/report ID, progress) in localStorage/sessionStorage
- [x] Backend: Use document/report IDs for stateless tracking; provide status/results endpoints
- [x] On reload, restore workflow from localStorage and fetch backend status/results
- [x] Show "Resume Workflow" option if an active workflow is detected
- [x] AWS S3 integration for workflow archiving
- [x] Resume workflow from archived data
- [x] Archive completed workflows before NFT minting
- [x] Manage archived workflows (list, delete)

### Document Management
- [x] Documents page: List all uploaded documents (with status: in progress, completed, minted)
- [x] Allow users to resume half-done workflows from documents page
- [x] Allow users to delete documents (if not minted)
- [x] Show status, results, and actions for each document

---

## Trust Score Integration TODO

- [x] Integrate Gemini 2.5 Flash API for trust score generation
- [x] Create server-side trust score calculator service
- [x] Implement trust score routes and endpoints
- [x] Update client components to call server-side trust score API
- [x] Display trust score results with detailed breakdown
- [x] Show recommendations from Gemini 2.5 Flash analysis
- [x] Add AI analysis summary (classification, probabilities, academic quality)
- [x] Implement component scores with progress bars
- [x] Add detailed analysis text display
- [x] Update file management UI to show trust score recommendations
- [x] Update landing trust score page to handle recommendations
- [x] Fix JSON parsing issues with Gemini API responses
- [x] Add fallback analysis extraction for malformed responses
- [x] Improve error handling and logging for trust score generation
- [x] Make trust score functional with real data from workflow

---

## Plagiarism Integration TODO

- [x] Integrate PlagiarismSearch API for plagiarism detection
- [x] Create server-side plagiarism checking service
- [x] Implement plagiarism routes and endpoints
- [x] Update client components to call server-side plagiarism API
- [x] Display plagiarism results with detailed breakdown
- [x] Show plagiarism matches and sources
- [x] Add plagiarism score display
- [x] Implement HTML report generation
- [x] Add polling for report completion
- [x] Fix URL paths for report fetching
- [x] Handle asynchronous processing with status updates
- [x] Add error handling for plagiarism checks
- [x] Create styled plagiarism report viewer component
- [x] Add PDF download functionality with Mintellect branding
- [x] Hide detailed report by default, show only on "View Report" click
- [x] Add proper highlights and styling for plagiarism matches
- [x] Implement progress bars and score visualization

---

## Remaining Tasks

### Frontend Enhancements
- [ ] Add loading states and better error handling for all API calls
- [ ] Implement proper form validation for file uploads
- [ ] Add file size limits and type validation
- [ ] Improve responsive design for mobile devices
- [ ] Add accessibility features (ARIA labels, keyboard navigation)

### Backend Improvements
- [ ] Add rate limiting for API endpoints
- [ ] Implement proper authentication and authorization
- [ ] Add request validation and sanitization
- [ ] Improve error handling and logging
- [ ] Add API documentation (Swagger/OpenAPI)

### Workflow Archiving Improvements
- [ ] Fix workflow archiving functionality (currently needs work)
- [ ] Improve archive data structure and persistence
- [ ] Add proper error handling for archive operations
- [ ] Test archive resume functionality thoroughly
- [ ] Add archive cleanup and maintenance features

### Testing & Quality Assurance
- [ ] Write unit tests for trust score calculator
- [ ] Write integration tests for API endpoints
- [ ] Add end-to-end tests for workflow
- [ ] Performance testing for large files
- [ ] Security testing for file uploads
- [ ] Test plagiarism report generation and download
- [ ] Test workflow archiving and resume functionality

### Documentation
- [ ] Update README with setup instructions
- [ ] Add API documentation
- [ ] Create user guide for workflow
- [ ] Document deployment process

---