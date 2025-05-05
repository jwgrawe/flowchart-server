Alright, now it's time to make the frontend look pretty. At least as pretty as we can without completing too much of the backend functionality. 
Currently, the frontend looks pretty lacking. It might be wise to use some of the examples from the assistant-ui repository and documentation and implement it before subsequently tweaking and modifying it. Assume that the chat interface eventually will connect to a backend service somewhere running ollama, but try to work around this for now. (If you at some point can't proceed without further backend clarification or functionality, let me know and I can help begin setting this up.)

Here are some purely inspirational ideas for frontend UI elements (many of which might already exist as examples/samples within the assistant-ui repository or docs):
- The chat interface (of course).
- A main preview area for showing the output flowchart of the Mermaid code, preferably scrollable and zoomable (probably based on simple test code, or even a simple placeholder graphic, to begin with).
- A small, expandable "see Mermaid code" section, where the user can expand, see and edit the raw Mermaid code.
- An area showing the "status" of the session, perhaps? (E.g. when the state of initializing the session).

To summarize your tasks: 
- Refer liberally to the assistant-ui documentation and repository in order to end up with a frontend interface that suits our purpose (and looks nice). 
- Draft an outline/plan for structuring the frontend, based mostly on how to reuse existing examples/samples from the assistant-ui, but also on the project's intended functionality.
- Do not begin building or changing things until you're certain that you've referenced relevant documentation (e.g. the assistant-ui's AssistantSidebar - "https://www.assistant-ui.com/docs/ui/AssistantSidebar", and similar).
- Modify and tweak the UI (particularly using your browser snapshot tool) as you go. 
