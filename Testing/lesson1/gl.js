function GLInstance(canvasID){
	var canvas = document.getElementById(canvasID),
		gl = canvas.getContext("webgl2");

	if(!gl){ console.error("WebGL context is not available."); return null; }
	gl.clearColor(1.0,1.0,1.0,1.0);	
	gl.fClear = function(){ this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT); return this; }
	gl.fSetSize = function(w,h){
		this.canvas.style.width = w *2 + "px";
		this.canvas.style.height = h  + "px";
		this.canvas.width = w * 2;
		this.canvas.height = h *2;
		this.viewport(0,0,w,h);
		return this;
	}
	return gl;
}