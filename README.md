## A very simplistic implementation of UI for node-based programming

### Deployed on Netlify: [node-based-pca-diy](https://node-based-pca-diy.netlify.app)

### Demo:

![Quick demo](demo-ui-gif.gif)

### What this web app is:

- dependencies: only Svelte and TailwindCSS frameworks  
- the core challenge was finding an approach to give users a very permissive UI **and** still "guide" them in the process of pseudo code "assembling" 
- users can add nodes that are principally logical pieces of Principal Component Analysis via Drag&Drop functionality; however, the algorithm prevents any invalid sequence of operations from being submitted/compiling/being sent to the server  
- restrictions added to nodes of type data example of stricter rules is demonstarted  
- delete functionality is implemented in a way that if user removes a node in the middle by mistake, it doesn’t destroy its entire progress  
- written in pure TypeScript without external libraries, so every element can be customized and extra interactivity added  
- svelte’s reactive and derived states play an important role in drawing/updating SVG connectors; however, Svelte part can be substituted with direct DOM manipulations  

### What this web app is NOT:

- NOT a true Principal Component Analisys (PCA) calculator; this webapp is client-side only, so no heavy math happens.  
- PCA was chosed just as a demo algorithm; the same UI approach could handle even algortihms that require iterations  
- NOT optimized for small touchscreens; it was tested on Firefox, Safari, and Chromium (Linux, macOS, Windows laptops/desktop PCs), but not on tablets. Drag-and-drop on devices with touch-centered devices differs from mouse devices, this web app is centered around Mouse events, not touch events 
- NOT meant to be fully responsive and work well on small screens; real-world node-based workflows are usually very complex (numerous connections and nodes), so they rarely suit small devices.  



