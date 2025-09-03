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

- [ ] Update FileUpload to accept .doc, .docx, .txt (and .tex later)
- [ ] Only allow one file per submission for simplicity
- [ ] Implement basic eligibility check (JS):
    - [ ] Minimum word count (e.g., >200 words)
    - [ ] Presence of title (first line or "Title:")
    - [ ] Paragraph structure (multiple paragraphs)
- [ ] Optionally: Integrate Gemini 2.5 Flash API for document classification (academic/research vs. random text)
    - [ ] Block non-academic documents from proceeding
    - [ ] Show feedback if not eligible
- [ ] If eligible, send file to FastAPI plagiarism server
    - [ ] Show progress and display results
- [ ] After plagiarism check, send full document to Gemini 2.5 flash for human-to-AI percent analysis
    - [ ] Display trust score to user
    - [ ] Optionally highlight AI-generated sections
- [ ] Add review step (optional human review)
- [ ] Add NFT minting step for eligible documents

### Workflow Context & Persistence
- [ ] Frontend: Store workflow state (step, document/report ID, progress) in localStorage/sessionStorage
- [ ] Backend: Use document/report IDs for stateless tracking; provide status/results endpoints
- [ ] On reload, restore workflow from localStorage and fetch backend status/results
- [ ] Show "Resume Workflow" option if an active workflow is detected

### Document Management
- [ ] Documents page: List all uploaded documents (with status: in progress, completed, minted)
- [ ] Allow users to resume half-done workflows from documents page
- [ ] Allow users to delete documents (if not minted)
- [ ] Show status, results, and actions for each document

---