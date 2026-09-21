var ag=Object.defineProperty;var wt=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')});var sg=(e,t)=>{for(var r in t)ag(e,r,{get:t[r],enumerable:!0})};var qi={padding:0,mean:[123.675,116.28,103.53],stdDeviation:[.017124753831663668,.01750700280112045,.017429193899782137],channelOrder:"rgb",maxSideLength:960,limitType:"max",maxSideLimit:4e3,textPixelThreshold:.3,boxScoreThreshold:.6,scoreMode:"fast",unclipRatio:1.5,maxCandidates:1e3,minimumAreaThreshold:20,paddingBoxVertical:.4,paddingBoxHorizontal:.6,dilationKernelSize:0,boxType:"quad"},Hi={mean:[127.5,127.5,127.5],stdDeviation:[1/127.5,1/127.5,1/127.5],channelOrder:"rgb",outputSelectionStrategy:"first",imageHeight:48,imageWidth:320,charactersDictionary:[],reverseText:!1},oo={mean:[.485*255,.456*255,.406*255],stdDeviation:[1/.229/255,1/.224/255,1/.225/255],channelOrder:"bgr",resizeMode:"stretch",resizeShort:256,imageHeight:224,imageWidth:224,labels:[],topK:1},Zs={...oo,imageHeight:80,imageWidth:160,labels:["0_degree","180_degree"],topK:1,threshold:.9,enabled:!0},uo={sortByReadingOrder:!0,sameLinePixelThreshold:10},Qs={recognitionScoreThreshold:.5,lineMergeThresholdRatio:.5},Ci={detection:qi,recognition:Hi};function Qt(e){"@babel/helpers - typeof";return Qt=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Qt(e)}function og(e,t){if(Qt(e)!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var i=r.call(e,t||"default");if(Qt(i)!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function ug(e){var t=og(e,"string");return Qt(t)=="symbol"?t:t+""}function xe(e,t,r){return(t=ug(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var Ni=class De{constructor(t,r,i,n){if(xe(this,"width",void 0),xe(this,"height",void 0),xe(this,"data",void 0),xe(this,"depth",void 0),xe(this,"channels",void 0),this.width=t,this.height=r,this.channels=i,this.depth=8,n)this.data=n;else{let a=t*r*4;this.data=new Uint8Array(a)}}crop(t){let{x:r,y:i,width:n,height:a}=t;if(r<0||i<0||r+n>this.width||i+a>this.height)throw new Error("Crop area is out of bounds");let s=new Uint8Array(n*a*this.channels);for(let o=0;o<a;o++)for(let l=0;l<n;l++){let d=((i+o)*this.width+(r+l))*this.channels,c=(o*n+l)*this.channels;s.set(this.data.subarray(d,d+this.channels),c)}return new De(n,a,this.channels,s)}cropRotated(t){let r=Math.max(Math.floor(Rr(t[0],t[1])),Math.floor(Rr(t[2],t[3])),1),i=Math.max(Math.floor(Rr(t[0],t[3])),Math.floor(Rr(t[1],t[2])),1),n=new Uint8Array(r*i*this.channels),a=lg([{x:0,y:0},{x:r,y:0},{x:r,y:i},{x:0,y:i}],t);for(let o=0;o<i;o++)for(let l=0;l<r;l++){let d=cg(a,l,o);this.sampleCubicPixel(d.x,d.y,n,(o*r+l)*this.channels)}let s=new De(r,i,this.channels,n);return i/r>=1.5?s.rotateCounterClockwise():s}rotate180(){let t=new Uint8Array(this.width*this.height*this.channels);for(let r=0;r<this.height;r++)for(let i=0;i<this.width;i++){let n=(r*this.width+i)*this.channels,a=this.width-1-i,s=((this.height-1-r)*this.width+a)*this.channels;t.set(this.data.subarray(n,n+this.channels),s)}return new De(this.width,this.height,this.channels,t)}rotateClockwise(){let t=new Uint8Array(this.width*this.height*this.channels),r=this.height,i=this.width;for(let n=0;n<i;n++)for(let a=0;a<r;a++){let s=n,o=((this.height-1-a)*this.width+s)*this.channels,l=(n*r+a)*this.channels;t.set(this.data.subarray(o,o+this.channels),l)}return new De(r,i,this.channels,t)}resize(t){let{width:r,height:i}=t;if(r===void 0&&i===void 0)throw new Error("At least one of width or height must be specified");if(r===void 0&&(r=Math.round(this.width*((i??this.height)/this.height))),i===void 0&&(i=Math.round(this.height*(r/this.width))),!Number.isInteger(r)||r<=0)throw new Error(`Invalid resize width: ${r}. Expected a positive integer.`);if(!Number.isInteger(i)||i<=0)throw new Error(`Invalid resize height: ${i}. Expected a positive integer.`);return t.filter==="triangle"?this.resizeTriangle(r,i):this.resizeBilinear(r,i)}resizeBilinear(t,r){let i=this.width,n=this.height,a=this.channels,s=this.data,o=new Uint8Array(t*r*a),l=i/t,d=n/r,c=(h,f,g)=>Math.max(f,Math.min(g,h));for(let h=0;h<r;h++){let f=(h+.5)*d-.5,g=Math.floor(f),m=f-g;g<0?(g=0,m=0):g>=n-1&&(g=n-1,m=0);let w=c(g+1,0,n-1);for(let v=0;v<t;v++){let x=(v+.5)*l-.5,b=Math.floor(x),S=x-b;b<0?(b=0,S=0):b>=i-1&&(b=i-1,S=0);let T=c(b+1,0,i-1),I=(h*t+v)*a,C=(g*i+b)*a,k=(g*i+T)*a,O=(w*i+b)*a,N=(w*i+T)*a;for(let L=0;L<a;L++){let X=s[C+L]*(1-S)+s[k+L]*S,F=s[O+L]*(1-S)+s[N+L]*S;o[I+L]=Math.round(c(X*(1-m)+F*m,0,255))}}}return new De(t,r,a,o)}resizeTriangle(t,r){let i=this.width,n=this.height,a=this.channels,s=this.data;function o(x){return x=Math.abs(x),x<1?1-x:0}function l(x,b,S){return Math.max(b,Math.min(S,x))}let d=new Float32Array(i*r*a),c=n/r,h=c<1?1:c,f=1*h;for(let x=0;x<r;x++){let b=(x+.5)*c-.5,S=Math.max(0,Math.floor(b-f)),T=Math.min(n,Math.ceil(b+f)),I=[],C=0;for(let k=S;k<T;k++){let O=o((k-b)/h);I.push(O),C+=O}for(let k=0;k<I.length;k++)I[k]/=C;for(let k=0;k<i;k++)for(let O=0;O<a;O++){let N=0;for(let L=0;L<I.length;L++){let X=((S+L)*i+k)*a+O;N+=s[X]*I[L]}d[(x*i+k)*a+O]=N}}let g=new Uint8Array(t*r*a),m=i/t,w=m<1?1:m,v=1*w;for(let x=0;x<t;x++){let b=(x+.5)*m-.5,S=Math.max(0,Math.floor(b-v)),T=Math.min(i,Math.ceil(b+v)),I=[],C=0;for(let k=S;k<T;k++){let O=o((k-b)/w);I.push(O),C+=O}for(let k=0;k<I.length;k++)I[k]/=C;for(let k=0;k<r;k++)for(let O=0;O<a;O++){let N=0;for(let L=0;L<I.length;L++){let X=(k*i+(S+L))*a+O;N+=d[X]*I[L]}g[(k*t+x)*a+O]=Math.round(l(N,0,255))}}return new De(t,r,a,g)}padding(t){let{padding:r,vertical:i,horizontal:n,top:a,bottom:s,left:o,right:l,color:d}=t;if(typeof r=="number"?a=s=o=l=r:(typeof i=="number"&&(a=s=i),typeof n=="number"&&(o=l=n)),a=a??0,s=s??0,o=o??0,l=l??0,d=d??Array(this.channels).fill(0),d.length<this.channels)throw new Error(`Color length ${d.length} does not match image channels ${this.channels}`);let c=this.width+o+l,h=this.height+a+s,f=new Uint8Array(c*h*this.channels);for(let g=0;g<h;g++)for(let m=0;m<c;m++){let w=(g*c+m)*this.channels;f.set(d.slice(0,this.channels),w)}for(let g=0;g<this.height;g++)for(let m=0;m<this.width;m++){let w=(g*this.width+m)*this.channels,v=((g+a)*c+(m+o))*this.channels;f.set(this.data.subarray(w,w+this.channels),v)}return new De(c,h,this.channels,f)}tensor(t){let r=t.mean_values,i=t.norm_values,n=t.channel_order??"rgb",a=this.width,s=this.height,o=3,l=this.data,d=new Float32Array(a*s*o);for(let c=0;c<s;c++)for(let h=0;h<a;h++){let f=(c*a+h)*this.channels,g=c*a+h;for(let m=0;m<o;m++){let w=l[f+(n==="bgr"?o-m-1:m)]*i[m]-r[m]*i[m];d[m*s*a+g]=w}}return d}threshold(t){let r=t.threshold??128,i=this.width,n=this.height,a=new Uint8Array(i*n);for(let s=0;s<i*n;s++)a[s]=this.data[s*this.channels]>r?255:0;return new De(i,n,1,a)}dilate(t={}){let{norm:r="LInf",k:i=1}=t;if(r!=="LInf")throw new Error("Only LInf norm is supported");if(this.channels!==1)throw new Error("Dilate only supports single channel (grayscale) images");if(!Number.isInteger(i)||i<0)throw new Error(`Invalid dilation kernel size: ${i}. Expected a non-negative integer.`);if(i<=1)return new De(this.width,this.height,this.channels,new Uint8Array(this.data));let n=this.width,a=this.height,s=this.data,o=new Uint8Array(n*a),l=Math.floor(i/2);for(let d=0;d<a;d++)for(let c=0;c<n;c++){let h=0;for(let f=0;f<i&&h===0;f++){let g=d+f-l;if(!(g<0||g>=a))for(let m=0;m<i;m++){let w=c+m-l;if(!(w<0||w>=n)&&s[g*n+w]>0){h=255;break}}}o[d*n+c]=h}return new De(n,a,1,o)}contours(t={}){let r=t.minArea??1,i=this.width,n=this.height,a=new Uint8Array(i*n);for(let d=0;d<i*n;d++)a[d]=this.data[d]>0?1:0;let s=new Uint8Array(i*n),o=[],l=(d,c)=>c*i+d;for(let d=0;d<n;d++)for(let c=0;c<i;c++)if(a[l(c,d)]&&!s[l(c,d)]){let h=c,f=d,g=c,m=d,w=0,v=[[c,d]],x=0;for(s[l(c,d)]=1;x<v.length;){let[b,S]=v[x];x++,w++,h=Math.min(h,b),f=Math.min(f,S),g=Math.max(g,b),m=Math.max(m,S);for(let[T,I]of[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]){let C=b+T,k=S+I;C>=0&&C<i&&k>=0&&k<n&&a[l(C,k)]&&!s[l(C,k)]&&(s[l(C,k)]=1,v.push([C,k]))}}w>=r&&o.push({x:h,y:f,width:g-h+1,height:m-f+1})}return o}rect(t){let{x:r,y:i,width:n,height:a,color:s=[],lineWidth:o=1}=t;if(s.length||s.push(...Array(this.channels).fill(255)),this.channels!==s.length)throw new Error(`Color length ${s.length} does not match image channels ${this.channels}`);for(let l=0;l<o;l++)for(let d=0;d<n;d++){let c=i+l,h=r+d;if(c>=0&&c<this.height&&h>=0&&h<this.width){let g=(c*this.width+h)*this.channels;this.data.set(s,g)}let f=i+a-1-l;if(f>=0&&f<this.height&&h>=0&&h<this.width){let g=(f*this.width+h)*this.channels;this.data.set(s,g)}}for(let l=0;l<o;l++)for(let d=0;d<a;d++){let c=r+l,h=i+d;if(c>=0&&c<this.width&&h>=0&&h<this.height){let g=(h*this.width+c)*this.channels;this.data.set(s,g)}let f=r+n-1-l;if(f>=0&&f<this.width&&h>=0&&h<this.height){let g=(h*this.width+f)*this.channels;this.data.set(s,g)}}}rotateCounterClockwise(){let t=new Uint8Array(this.width*this.height*this.channels),r=this.height,i=this.width;for(let n=0;n<i;n++)for(let a=0;a<r;a++){let s=this.width-1-n,o=(a*this.width+s)*this.channels,l=(n*r+a)*this.channels;t.set(this.data.subarray(o,o+this.channels),l)}return new De(r,i,this.channels,t)}sampleCubicPixel(t,r,i,n){let a=Math.floor(t),s=Math.floor(r),o=Js(t-a),l=Js(r-s);for(let d=0;d<this.channels;d++){let c=0;for(let h=0;h<4;h++){let f=eo(s+h-1,0,this.height-1);for(let g=0;g<4;g++){let m=eo(a+g-1,0,this.width-1),w=this.data[(f*this.width+m)*this.channels+d];c+=w*o[g]*l[h]}}i[n+d]=Math.round(pg(c,0,255))}}};function Rr(e,t){return Math.hypot(e.x-t.x,e.y-t.y)}function lg(e,t){let r=[],i=[];for(let a=0;a<4;a++){let s=e[a],o=t[a];r.push([s.x,s.y,1,0,0,0,-s.x*o.x,-s.y*o.x]),i.push(o.x),r.push([0,0,0,s.x,s.y,1,-s.x*o.y,-s.y*o.y]),i.push(o.y)}let n=dg(r,i);return[n[0],n[1],n[2],n[3],n[4],n[5],n[6],n[7],1]}function dg(e,t){let r=t.length,i=e.map((n,a)=>[...n,t[a]]);for(let n=0;n<r;n++){let a=n;for(let o=n+1;o<r;o++)Math.abs(i[o][n])>Math.abs(i[a][n])&&(a=o);if(Math.abs(i[a][n])<Number.EPSILON)throw new Error("Cannot calculate perspective transform from degenerate points");a!==n&&([i[n],i[a]]=[i[a],i[n]]);let s=i[n][n];for(let o=n;o<=r;o++)i[n][o]/=s;for(let o=0;o<r;o++){if(o===n)continue;let l=i[o][n];for(let d=n;d<=r;d++)i[o][d]-=l*i[n][d]}}return i.map(n=>n[r])}function cg(e,t,r){let i=e[6]*t+e[7]*r+e[8];return Math.abs(i)<Number.EPSILON?{x:0,y:0}:{x:(e[0]*t+e[1]*r+e[2])/i,y:(e[3]*t+e[4]*r+e[5])/i}}function Js(e){let r=e+1,i=1-e,n=((-.75*r-5*-.75)*r+8*-.75)*r-4*-.75,a=((-.75+2)*e-(-.75+3))*e*e+1,s=((-.75+2)*i-(-.75+3))*i*i+1;return[n,a,s,1-n-a-s]}function pg(e,t,r){return Math.max(t,Math.min(r,e))}function eo(e,t,r){return Math.max(t,Math.min(r,e))}function lo(e){if(!Number.isInteger(e.width)||e.width<=0)throw new Error(`Invalid input width: ${e.width}. Expected a positive integer.`);if(!Number.isInteger(e.height)||e.height<=0)throw new Error(`Invalid input height: ${e.height}. Expected a positive integer.`);let t=e.width*e.height,r=e.data.length/t;if(!Number.isInteger(r)||r<1||r>4)throw new Error(`Invalid input data length ${e.data.length} for image size ${e.width}x${e.height}. Expected 1, 2, 3, or 4 channels.`);if(r===3)return new Ni(e.width,e.height,3,e.data);let i=new Uint8Array(t*3);for(let n=0;n<t;n++){let a=n*r,s=n*3;if(r===1||r===2){let o=e.data[a];i[s]=o,i[s+1]=o,i[s+2]=o;continue}i[s]=e.data[a],i[s+1]=e.data[a+1],i[s+2]=e.data[a+2]}return new Ni(e.width,e.height,3,i)}var Q0=hg();function hg(){let e=[];for(let i=33;i<=126;i+=1)e.push(i);for(let i=161;i<=172;i+=1)e.push(i);for(let i=174;i<=255;i+=1)e.push(i);let t=e.slice(),r=0;for(let i=0;i<=255;i+=1)e.includes(i)||(e.push(i),t.push(256+r),r+=1);return new Map(t.map((i,n)=>[String.fromCodePoint(i),e[n]]))}var fg={inputChannels:1,grayscaleMean:.7931,grayscaleStdDeviation:.1738,cropMarginThreshold:200,cropMarginMaxAspectRatio:200,imagePaddingValue:0,latexPaddingValue:1,inputName:"x",maxSequenceLength:2560,preprocessPipeline:["UniMERNetImgDecode","UniMERNetTestTransform","LatexImageFormat","UniMERNetLabelEncode"],decoderName:"UniMERNetDecode",tokenizerType:"NougatTokenizer",tokenizerPath:"ppocr/utils/dict/unimernet_tokenizer",specialTokenIds:{bos:0,pad:1,eos:2,unk:3}};function Xt(e,t){return{...fg,imageHeight:e,imageWidth:e,maxSequenceLength:t}}var J0={"PP-FormulaNet-S":{name:"PP-FormulaNet-S",module:"formula_recognition",architecture:"PP-FormulaNet",options:Xt(384,1024)},"PP-FormulaNet-L":{name:"PP-FormulaNet-L",module:"formula_recognition",architecture:"PP-FormulaNet",options:Xt(768,1024)},"PP-FormulaNet_plus-S":{name:"PP-FormulaNet_plus-S",module:"formula_recognition",architecture:"PP-FormulaNet",options:Xt(384,1024)},"PP-FormulaNet_plus-M":{name:"PP-FormulaNet_plus-M",module:"formula_recognition",architecture:"PP-FormulaNet",options:Xt(384,2560)},"PP-FormulaNet_plus-L":{name:"PP-FormulaNet_plus-L",module:"formula_recognition",architecture:"PP-FormulaNet",options:Xt(768,2560)}};var mg=["0_degree","180_degree"],co={mean:[.485*255,.456*255,.406*255],stdDeviation:[1/.229/255,1/.224/255,1/.225/255],channelOrder:"bgr"},to={imageHeight:224,imageWidth:224,resizeMode:"resize-short-crop",resizeShort:256,...co},ro={imageHeight:80,imageWidth:160,resizeMode:"stretch",...co,labels:mg,topK:1},eb={"PP-LCNet_x1_0_doc_ori":{name:"PP-LCNet_x1_0_doc_ori",module:"doc_image_orientation_classification",options:{...to,labels:["0","90","180","270"],topK:1}},"PP-LCNet_x0_25_textline_ori":{name:"PP-LCNet_x0_25_textline_ori",module:"textline_orientation_classification",options:ro},"PP-LCNet_x1_0_textline_ori":{name:"PP-LCNet_x1_0_textline_ori",module:"textline_orientation_classification",options:ro},"PP-LCNet_x1_0_table_cls":{name:"PP-LCNet_x1_0_table_cls",module:"table_classification",options:{...to,labels:["wired_table","wireless_table"],topK:5}}};function Fi(e,t){return{[e.inputNames?.[0]??"x"]:t}}function Oi(e,t){let r=e.inputMetadata?.[0]?.shape?.[t];if(!(typeof r!="number"||r<=0||!Number.isFinite(r)))return r}function Vi(e){return{channels:Oi(e,1),height:Oi(e,2),width:Oi(e,3)}}var gg=class{constructor(e,t,r={}){xe(this,"options",void 0),xe(this,"session",void 0),xe(this,"ortModule",void 0),this.session=t,this.ortModule=e,this.options={...r}}async run(e,t={}){let r=this.resolveRuntimeOptions(t);this.validateRuntimeOptions(r);let i=this.preprocessImage(lo(e),r).tensor({mean_values:r.mean,norm_values:r.stdDeviation,channel_order:r.channelOrder}),n=new this.ortModule.Tensor("float32",i,[1,3,r.imageHeight,r.imageWidth]),a=await this.runInference(n),s=this.extractScores(a),o=Math.min(r.topK,s.length);return Array.from(s,(l,d)=>({classId:d,score:l})).sort((l,d)=>d.score-l.score).slice(0,o).map(l=>({...l,label:r.labels[l.classId]??String(l.classId)}))}resolveRuntimeOptions(e={}){let t=this.resolveFixedInputShape();return{...oo,...t,...this.options,...e}}resolveFixedInputShape(){let e=Vi(this.session);return!e.height||!e.width?{}:{imageHeight:e.height,imageWidth:e.width}}preprocessImage(e,t){if(t.resizeMode==="stretch")return e.resize({width:t.imageWidth,height:t.imageHeight});if(t.resizeMode==="resize-short-crop")return this.resizeShortAndCenterCrop(e,t);let r=Math.min(Math.ceil(t.imageHeight*(e.width/e.height)),t.imageWidth),i=e.resize({width:r,height:t.imageHeight});return r===t.imageWidth?i:i.padding({right:t.imageWidth-r,color:[0,0,0]})}resizeShortAndCenterCrop(e,t){let r=t.resizeShort/Math.min(e.width,e.height),i=Math.round(e.width*r),n=Math.round(e.height*r),a=e.resize({width:i,height:n});if(a.width<t.imageWidth||a.height<t.imageHeight)throw new Error(`Invalid classification resizeShort: ${t.resizeShort}. Resized image ${a.width}x${a.height} is smaller than crop ${t.imageWidth}x${t.imageHeight}.`);return a.crop({x:Math.floor((a.width-t.imageWidth)/2),y:Math.floor((a.height-t.imageHeight)/2),width:t.imageWidth,height:t.imageHeight})}validateRuntimeOptions(e){if(!Number.isInteger(e.imageWidth)||e.imageWidth<=0)throw new Error(`Invalid classification imageWidth: ${e.imageWidth}. Expected a positive integer.`);if(!Number.isInteger(e.imageHeight)||e.imageHeight<=0)throw new Error(`Invalid classification imageHeight: ${e.imageHeight}. Expected a positive integer.`);if(!Number.isInteger(e.topK)||e.topK<=0)throw new Error(`Invalid classification topK: ${e.topK}. Expected a positive integer.`);if(e.resizeMode!=="stretch"&&e.resizeMode!=="pad"&&e.resizeMode!=="resize-short-crop")throw new Error(`Unsupported classification resizeMode: ${e.resizeMode}. Expected "stretch", "pad", or "resize-short-crop".`);if(!Number.isInteger(e.resizeShort)||e.resizeShort<=0)throw new Error(`Invalid classification resizeShort: ${e.resizeShort}. Expected a positive integer.`)}async runInference(e){let t=await this.session.run(Fi(this.session,e)),r=this.session.outputNames[0]??Object.keys(t)[0],i=r?t[r]:void 0;if(!i)throw new Error(`Classification output tensor '${r??"<none>"}' not found. Available keys: ${Object.keys(t).join(", ")}`);return i}extractScores(e){let{data:t,dims:r}=e;if(!(t instanceof Float32Array))throw new Error("Classification output tensor must contain Float32Array data.");if(r.length===1){if(t.length!==r[0])throw new Error(`Classification output shape [${r.join(",")}] does not match data length ${t.length}.`);return t}if(r.length===2&&(r[0]===1||r[0]===-1)&&r[1]>0){if(t.length!==r[1])throw new Error(`Classification output shape [${r.join(",")}] does not match data length ${t.length}.`);return t}throw new Error(`Unsupported classification output shape [${r.join(",")}]. Expected [C] or [1,C].`)}};var _t={mean:[0,0,0],stdDeviation:[1/255,1/255,1/255],channelOrder:"bgr",threshold:.5,outputLayout:"class-score-xyxy"},et=["image","im_shape","scale_factor"],Mr=["image","scale_factor"],yg=["paragraph_title","image","text","number","abstract","content","figure_title","formula","table","reference","doc_title","footnote","header","algorithm","footer","seal","chart","formula_number","aside_text","reference_content"],zi=["paragraph_title","image","text","number","abstract","content","figure_title","formula","table","table_title","reference","doc_title","footnote","header","algorithm","footer","seal","chart_title","chart","formula_number","header_image","footer_image","aside_text"],io=["cell"],bg=["Region"],tb={"PP-DocLayout_plus-L":{name:"PP-DocLayout_plus-L",module:"layout_detection",architecture:"DETR",requiredInputNames:et,options:{..._t,requiredInputNames:et,imageHeight:800,imageWidth:800,labels:yg}},"PP-DocLayout-L":{name:"PP-DocLayout-L",module:"layout_detection",architecture:"DETR",requiredInputNames:et,options:{..._t,requiredInputNames:et,imageHeight:640,imageWidth:640,labels:zi}},"PP-DocLayout-M":{name:"PP-DocLayout-M",module:"layout_detection",architecture:"GFL",requiredInputNames:Mr,options:{..._t,requiredInputNames:Mr,imageHeight:640,imageWidth:640,mean:[.485*255,.456*255,.406*255],stdDeviation:[1/.229/255,1/.224/255,1/.225/255],labels:zi}},"PP-DocLayout-S":{name:"PP-DocLayout-S",module:"layout_detection",architecture:"GFL",requiredInputNames:Mr,options:{..._t,requiredInputNames:Mr,imageHeight:480,imageWidth:480,mean:[.485*255,.456*255,.406*255],stdDeviation:[1/.229/255,1/.224/255,1/.225/255],labels:zi}},"PP-DocBlockLayout":{name:"PP-DocBlockLayout",module:"layout_detection",architecture:"DETR",requiredInputNames:et,options:{..._t,requiredInputNames:et,imageHeight:640,imageWidth:640,labels:bg}},"RT-DETR-L_wired_table_cell_det":{name:"RT-DETR-L_wired_table_cell_det",module:"table_cells_detection",architecture:"DETR",requiredInputNames:et,options:{..._t,requiredInputNames:et,imageHeight:640,imageWidth:640,labels:io}},"RT-DETR-L_wireless_table_cell_det":{name:"RT-DETR-L_wireless_table_cell_det",module:"table_cells_detection",architecture:"DETR",requiredInputNames:et,options:{..._t,requiredInputNames:et,imageHeight:640,imageWidth:640,labels:io}}};var wg={imageHeight:488,imageWidth:488,maxSideLength:488,mean:[.485*255,.456*255,.406*255],stdDeviation:[1/.229/255,1/.224/255,1/.225/255],channelOrder:"bgr",maxTextLength:500,locRegNum:8,mergeNoSpanStructure:!0,replaceEmptyCellToken:!1,learnEmptyBox:!1,structureDictionary:["<thead>","</thead>","<tbody>","</tbody>","<tr>","</tr>","<td>","<td",">","</td>",' colspan="2"',' colspan="3"',' colspan="4"',' colspan="5"',' colspan="6"',' colspan="7"',' colspan="8"',' colspan="9"',' colspan="10"',' colspan="11"',' colspan="12"',' colspan="13"',' colspan="14"',' colspan="15"',' colspan="16"',' colspan="17"',' colspan="18"',' colspan="19"',' colspan="20"',' rowspan="2"',' rowspan="3"',' rowspan="4"',' rowspan="5"',' rowspan="6"',' rowspan="7"',' rowspan="8"',' rowspan="9"',' rowspan="10"',' rowspan="11"',' rowspan="12"',' rowspan="13"',' rowspan="14"',' rowspan="15"',' rowspan="16"',' rowspan="17"',' rowspan="18"',' rowspan="19"',' rowspan="20"']},rb={...wg,imageHeight:512,imageWidth:512,maxSideLength:512,ignoreBboxes:!0};var Ri={channelOrder:"bgr",maxSideLength:736,limitType:"min",maxSideLimit:4e3,textPixelThreshold:.2,boxScoreThreshold:.45,maxCandidates:3e3,unclipRatio:1.4},no={channelOrder:"bgr",maxSideLength:736,limitType:"resize_long",maxSideLimit:4e3,textPixelThreshold:.2,boxScoreThreshold:.6,maxCandidates:1e3,unclipRatio:.5,boxType:"poly"},ib={"PP-OCRv6_tiny_det":{name:"PP-OCRv6_tiny_det",module:"text_detection",options:{...Ri,boxScoreThreshold:.4}},"PP-OCRv6_small_det":{name:"PP-OCRv6_small_det",module:"text_detection",options:Ri},"PP-OCRv6_medium_det":{name:"PP-OCRv6_medium_det",module:"text_detection",options:Ri},"PP-OCRv4_mobile_seal_det":{name:"PP-OCRv4_mobile_seal_det",module:"seal_text_detection",options:no},"PP-OCRv4_server_seal_det":{name:"PP-OCRv4_server_seal_det",module:"seal_text_detection",options:no}};var Jt=1e-12,_g=.002;function xg(e,t){let r=kg(e);if(r.length<3||!Number.isFinite(t)||Math.abs(t)<.5)return r;let i=Ag(r);if(Math.abs(i)<=Jt)return[];let n=i<0?-t:t,a=Math.abs(n);if(a<=Jt)return r;let s=Tg(r),o=a*_g,l=Math.min(Math.PI/Math.acos(1-o/a),a*Math.PI),d=Math.sin(2*Math.PI/l)*(n<0?-1:1),c=Math.cos(2*Math.PI/l),h=l/(2*Math.PI),f=[];for(let g=0,m=r.length-1;g<r.length;m=g,g++)$g(r,s,g,m,n,d,c,h,f);return Cg(Eg(f))}function $g(e,t,r,i,n,a,s,o,l){if(Br(e[r],e[i]))return;let d=Mg(t[r],t[i]),c=Rg(t[r],t[i]);if(d=Math.max(-1,Math.min(1,d)),Math.abs(n)<=Jt){Zt(l,e[r]);return}if(c>-.999&&d*n<0){Zt(l,vg(e,t,r,i,n));return}Sg(e,t,r,i,Math.atan2(d,c),n,a,s,o,l)}function vg(e,t,r,i,n){let a=(r+1)%e.length;return zg(Lt(e[i],t[i],n),Lt(e[r],t[i],n),Lt(e[r],t[r],n),Lt(e[a],t[r],n))??Lt(e[r],t[r],n)}function Sg(e,t,r,i,n,a,s,o,l,d){let c=e[r],h={x:t[i].x*a,y:t[i].y*a};Zt(d,{x:c.x+h.x,y:c.y+h.y});let f=Math.ceil(l*Math.abs(n));for(let g=1;g<f;g++)h={x:h.x*o-s*h.y,y:h.x*s+h.y*o},Zt(d,{x:c.x+h.x,y:c.y+h.y});Zt(d,Lt(c,t[r],a))}function Tg(e){return e.map((t,r)=>Ig(t,e[(r+1)%e.length]))}function Ig(e,t){let r=t.x-e.x,i=t.y-e.y,n=Math.hypot(r,i);return n<=Jt?{x:0,y:0}:{x:i/n,y:-r/n}}function Lt(e,t,r){return{x:e.x+t.x*r,y:e.y+t.y*r}}function Zt(e,t){e.push({x:Math.round(t.x),y:Math.round(t.y)})}function kg(e){let t=e.slice(),r=t[0],i=t[t.length-1];return r&&i&&Br(r,i)&&t.pop(),t}function Eg(e){let t=[];for(let n of e){let a=t[t.length-1];a&&Br(a,n)||t.push(n)}let r=t[0],i=t[t.length-1];return r&&i&&Br(r,i)&&t.pop(),t}function Cg(e){if(e.length<3)return e;let t=[];for(let r=0;r<e.length;r++){let i=e[(r+e.length-1)%e.length],n=e[r],a=e[(r+1)%e.length];Og(n,i,a)||t.push(n)}return t}function Og(e,t,r){let i=(r.x-t.x)*(e.y-t.y)-(r.y-t.y)*(e.x-t.x);return Math.abs(i)>1e-9?!1:e.x>=Math.min(t.x,r.x)&&e.x<=Math.max(t.x,r.x)&&e.y>=Math.min(t.y,r.y)&&e.y<=Math.max(t.y,r.y)}function zg(e,t,r,i){let n=t.x-e.x,a=t.y-e.y,s=i.x-r.x,o=i.y-r.y,l=n*o-a*s;if(Math.abs(l)<Jt)return null;let d=((r.x-e.x)*o-(r.y-e.y)*s)/l;return{x:e.x+d*n,y:e.y+d*a}}function Br(e,t){return e.x===t.x&&e.y===t.y}function Rg(e,t){return e.x*t.x+e.y*t.y}function Mg(e,t){return e.y*t.x-t.y*e.x}function Ag(e){let t=0;for(let r=0;r<e.length;r++){let i=e[r],n=e[(r+1)%e.length];t+=i.x*n.y-n.x*i.y}return t/2}function Pg(e,t,r,i){let n=new Uint8Array(t*r),a=[],s=(o,l)=>l*t+o;for(let o=0;o<r;o++)for(let l=0;l<t;l++){let d=s(l,o);if(!e[d]||n[d])continue;let c=[{x:l,y:o}],h=[],f=[],g=0;for(n[d]=1;g<c.length;){let m=c[g];g++,h.push(m),Wg(e,t,r,m.x,m.y)&&f.push(m);for(let[w,v]of[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]){let x=m.x+w,b=m.y+v;if(x<0||x>=t||b<0||b>=r)continue;let S=s(x,b);!e[S]||n[S]||(n[S]=1,c.push({x,y:b}))}}if(h.length>=i.minimumAreaThreshold&&f.length>=3){let m=qg(h,e,t,r);for(let w of m)a.push({area:Math.abs(Gg(w)),points:w,pixels:h})}}return a}function Ng(e,t,r){if(t<0||!Number.isFinite(t))throw new Error("Epsilon must be a finite non-negative number");if(e.length<=2)return[...e];let i=r?Dg(e):[...e];return i.length<=2?i:r?Bg(i,t):Bi(i,t)}function Bg(e,t){let r=Lg(e,e[0]);if(r<=0)return[...e];let i=Bi(e.slice(0,r+1),t),n=Bi([...e.slice(r),e[0]],t),a=Ug([...i,...n.slice(1,-1)]);return a.length>=3?a:[...e]}function Bi(e,t){let r=new Uint8Array(e.length);r[0]=1,r[e.length-1]=1;let i=[[0,e.length-1]],n=t*t;for(;i.length;){let[s,o]=i.pop(),l=0,d=-1;for(let c=s+1;c<o;c++){let h=Vg(e[c],e[s],e[o]);h>l&&(l=h,d=c)}d>=0&&l>n&&(r[d]=1,i.push([s,d],[d,o]))}let a=[];for(let s=0;s<e.length;s++)r[s]&&a.push(e[s]);return a}function Dg(e){let t=[...e],r=t[0],i=t[t.length-1];return r&&i&&r.x===i.x&&r.y===i.y&&t.pop(),t}function Lg(e,t){let r=0,i=-1/0;for(let n=1;n<e.length;n++){let a=Di(e[n],t);a>i&&(i=a,r=n)}return r}function Ug(e){let t=[];for(let r of e){let i=t[t.length-1];i&&i.x===r.x&&i.y===r.y||t.push(r)}return t}function Wg(e,t,r,i,n){for(let[a,s]of[[-1,0],[1,0],[0,-1],[0,1]]){let o=i+a,l=n+s;if(o<0||o>=t||l<0||l>=r||!e[l*t+o])return!0}return!1}function qg(e,t,r,i){let n=new Map;for(let o of e)Hg(n,o,t,r,i);let a=new Set,s=[];for(let o of n.values())for(let l of o){if(a.has(l.id))continue;let d=Fg(l,n,a);d.length>=3&&s.push(d)}return s.length>0?s:[e]}function Hg(e,t,r,i,n){let{x:a,y:s}=t;Pr(r,i,n,a,s-1)||Ar(e,{x:a,y:s},{x:a+1,y:s}),Pr(r,i,n,a+1,s)||Ar(e,{x:a+1,y:s},{x:a+1,y:s+1}),Pr(r,i,n,a,s+1)||Ar(e,{x:a+1,y:s+1},{x:a,y:s+1}),Pr(r,i,n,a-1,s)||Ar(e,{x:a,y:s+1},{x:a,y:s})}function Ar(e,t,r){let i={start:t,end:r,id:`${$t(t)}>${$t(r)}`},n=e.get($t(t))??[];n.push(i),e.set($t(t),n)}function Fg(e,t,r){let i=[],n=e,a=$t(e.start);for(;n&&!r.has(n.id)&&(r.add(n.id),i.push(n.start),n=t.get($t(n.end))?.filter(s=>!r.has(s.id))?.[0],!(n&&$t(n.start)===a&&i.length>1)););return i}function Pr(e,t,r,i,n){return i>=0&&i<t&&n>=0&&n<r&&!!e[n*t+i]}function $t(e){return`${e.x},${e.y}`}function Vg(e,t,r){let i=r.x-t.x,n=r.y-t.y,a=i*i+n*n;if(a<=Number.EPSILON)return Di(e,t);let s=Math.max(0,Math.min(1,((e.x-t.x)*i+(e.y-t.y)*n)/a));return Di(e,{x:t.x+s*i,y:t.y+s*n})}function Di(e,t){let r=e.x-t.x,i=e.y-t.y;return r*r+i*i}function Gg(e){let t=0;for(let r=0;r<e.length;r++){let i=e[r],n=e[(r+1)%e.length];t+=i.x*n.y-n.x*i.y}return t/2}var er=3;function jg(e,t,r){Kg(r.scoreMode),Xg(r.boxType),Yg(r.dilationKernelSize);let{dstWidth:i,dstHeight:n}=t.resizeParams,a=ey(e,i,n),s=new Ni(i,n,1,ty(a,r.textPixelThreshold)),o=Pg((r.dilationKernelSize>0?s.dilate({norm:"LInf",k:r.dilationKernelSize}):s).data,i,n,{minimumAreaThreshold:r.minimumAreaThreshold}),l=[];for(let d of o.slice(0,r.maxCandidates)){let c=r.boxType==="poly"?Qg(d,a,t,r):Zg(d,a,t,r);c&&l.push(c)}return l}function Kg(e){if(!(e==="fast"||e==="slow"))throw new Error(`Unsupported DB scoreMode: ${String(e)}. Expected "fast" or "slow".`)}function Xg(e){if(!(e==="quad"||e==="poly"))throw new Error(`Unsupported DB boxType: ${String(e)}. Expected "quad" or "poly".`)}function Yg(e){if(!(Number.isInteger(e)&&e>=0))throw new Error(`Invalid DB dilationKernelSize: ${String(e)}. Expected a non-negative integer.`)}function Zg(e,t,r,i){let{dstWidth:n,dstHeight:a}=r.resizeParams,s=Li(e.points);if(!s||s.shortSide<er||po(t,n,a,i.scoreMode==="slow"?e.points:s.points)<i.boxScoreThreshold)return null;let o=Li(ho(s.points,i.unclipRatio));return!o||o.shortSide<er+2?null:sy(fo(ny(o.points,r.resizeParams)),r.resizeParams.srcWidth,r.resizeParams.srcHeight)}function Qg(e,t,r,i){let{dstWidth:n,dstHeight:a}=r.resizeParams,s=Jg(e.points);if(s.length<4||po(t,n,a,s)<i.boxScoreThreshold)return null;let o=ho(s,i.unclipRatio),l=Li(o);return!l||l.shortSide<er+2?null:uy(ay(o,r.resizeParams),r.resizeParams.srcWidth,r.resizeParams.srcHeight)}function Jg(e){return Ng(e,.002*go(e),!0)}function po(e,t,r,i){let n=Math.max(0,Math.floor(Math.min(...i.map(h=>h.x)))),a=Math.min(t-1,Math.ceil(Math.max(...i.map(h=>h.x)))),s=Math.max(0,Math.floor(Math.min(...i.map(h=>h.y)))),o=Math.min(r-1,Math.ceil(Math.max(...i.map(h=>h.y)))),l=i.map(h=>({x:Math.trunc(h.x-n),y:Math.trunc(h.y-s)})),d=0,c=0;for(let h=s;h<=o;h++)for(let f=n;f<=a;f++)ly({x:f-n,y:h-s},l)&&(d+=e[h*t+f],c++);return c>0?d/c:0}function ey(e,t,r){let i=t*r;if(e.length<i||e.length%i!==0)throw new Error(`Invalid DB output length: got ${e.length} values for ${t}x${r} score maps; expected one or more complete channels of ${i} values.`);return e.slice(0,i)}function ty(e,t){let r=new Uint8Array(e.length);for(let i=0;i<e.length;i++)r[i]=e[i]>t?255:0;return r}function Li(e){if(e.length<3)return null;let t=ry(e);if(t.length<3)return null;let r=null,i=1/0,n=0;for(let a=0;a<t.length;a++){let s=t[a],o=t[(a+1)%t.length],l=Math.atan2(o.y-s.y,o.x-s.x),d=Math.cos(-l),c=Math.sin(-l),h=1/0,f=-1/0,g=1/0,m=-1/0;for(let b of t){let S=b.x*d-b.y*c,T=b.x*c+b.y*d;h=Math.min(h,S),f=Math.max(f,S),g=Math.min(g,T),m=Math.max(m,T)}let w=f-h,v=m-g,x=w*v;x>=i||(r=fo([{x:h,y:g},{x:f,y:g},{x:f,y:m},{x:h,y:m}].map(b=>iy(b,l))),i=x,n=Math.min(w,v))}return r?{points:r,shortSide:n}:null}function ry(e){let t=[...e].sort((n,a)=>n.x===a.x?n.y-a.y:n.x-a.x).filter((n,a,s)=>a===0||n.x!==s[a-1].x||n.y!==s[a-1].y);if(t.length<=1)return t;let r=[];for(let n of t){for(;r.length>=2&&Ui(r[r.length-2],r[r.length-1],n)<=0;)r.pop();r.push(n)}let i=[];for(let n=t.length-1;n>=0;n--){let a=t[n];for(;i.length>=2&&Ui(i[i.length-2],i[i.length-1],a)<=0;)i.pop();i.push(a)}return r.pop(),i.pop(),r.concat(i)}function iy(e,t){let r=Math.cos(t),i=Math.sin(t);return{x:e.x*r-e.y*i,y:e.x*i+e.y*r}}function ho(e,t){let r=Math.abs(cy(e)),i=go(e);return r<=0||i<=0?e:xg(e,r*t/i)}function ny(e,t){return e.map(r=>({x:r.x/t.scaleWidth,y:r.y/t.scaleHeight}))}function ay(e,t){return e.map(r=>({x:r.x/t.scaleWidth,y:r.y/t.scaleHeight}))}function fo(e){if(e.length!==4)throw new Error(`Expected exactly four points, got ${e.length}.`);let[t,r,i,n]=[...e].sort((o,l)=>o.x-l.x),a=r.y>t.y?t:r,s=r.y>t.y?r:t;return[a,n.y>i.y?i:n,n.y>i.y?n:i,s]}function sy(e,t,r){let i=e.map(c=>mo(c,t,r));if(!oy(i))return null;let n=Math.floor(Math.min(...i.map(c=>c.x))),a=Math.ceil(Math.max(...i.map(c=>c.x))),s=Math.floor(Math.min(...i.map(c=>c.y))),o=Math.ceil(Math.max(...i.map(c=>c.y))),l=Math.min(t-n,a-n),d=Math.min(r-s,o-s);return l<=0||d<=0?null:{x:n,y:s,width:l,height:d,points:i}}function oy(e){let t=Math.trunc(Math.hypot(e[0].x-e[1].x,e[0].y-e[1].y)),r=Math.trunc(Math.hypot(e[0].x-e[3].x,e[0].y-e[3].y));return t>er&&r>er}function uy(e,t,r){let i=e.map(c=>mo(c,t,r)),n=Math.floor(Math.min(...i.map(c=>c.x))),a=Math.ceil(Math.max(...i.map(c=>c.x))),s=Math.floor(Math.min(...i.map(c=>c.y))),o=Math.ceil(Math.max(...i.map(c=>c.y))),l=Math.min(t-n,a-n),d=Math.min(r-s,o-s);return l<=0||d<=0?null:{x:n,y:s,width:l,height:d,polygon:i}}function mo(e,t,r){let i=Math.max(0,t-1),n=Math.max(0,r-1);return{x:Math.max(0,Math.min(i,Math.round(e.x))),y:Math.max(0,Math.min(n,Math.round(e.y)))}}function Ui(e,t,r){return(t.x-e.x)*(r.y-e.y)-(t.y-e.y)*(r.x-e.x)}function ly(e,t){let r=!1;for(let i=0,n=t.length-1;i<t.length;n=i++){let a=t[i],s=t[n];if(dy(e,s,a))return!0;a.y>e.y!=s.y>e.y&&e.x<(s.x-a.x)*(e.y-a.y)/(s.y-a.y)+a.x&&(r=!r)}return r}function dy(e,t,r){let i=Ui(t,r,e);return Math.abs(i)>1e-6?!1:e.x>=Math.min(t.x,r.x)-1e-6&&e.x<=Math.max(t.x,r.x)+1e-6&&e.y>=Math.min(t.y,r.y)-1e-6&&e.y<=Math.max(t.y,r.y)+1e-6}function cy(e){let t=0;for(let r=0;r<e.length;r++){let i=e[r],n=e[(r+1)%e.length];t+=i.x*n.y-n.x*i.y}return t/2}function go(e){let t=0;for(let r=0;r<e.length;r++){let i=e[r],n=e[(r+1)%e.length];t+=Math.hypot(i.x-n.x,i.y-n.y)}return t}function py(e,t){let r=hy(e,t);return{tensor:(e.width===r.resizeSourceWidth&&e.height===r.resizeSourceHeight?e:e.padding({right:r.resizeSourceWidth-e.width,bottom:r.resizeSourceHeight-e.height,color:[0,0,0]})).resize({width:r.dstWidth,height:r.dstHeight}).tensor({mean_values:t.mean,norm_values:t.stdDeviation,channel_order:t.channelOrder}),resizeParams:r}}function hy(e,t){let{width:r,height:i}=e,n=r+i<64?Math.max(32,r):r,a=r+i<64?Math.max(32,i):i,s=t.inputShape;if(s){let[,v,x]=s;if(!Number.isInteger(x)||x<=0)throw new Error(`Invalid detection inputShape width: ${x}. Expected a positive integer.`);if(!Number.isInteger(v)||v<=0)throw new Error(`Invalid detection inputShape height: ${v}. Expected a positive integer.`);return{srcHeight:i,srcWidth:r,resizeSourceHeight:a,resizeSourceWidth:n,dstHeight:v,dstWidth:x,scaleWidth:x/n,scaleHeight:v/a}}let o=t.maxSideLength,l=t.limitType,d=t.maxSideLimit,c=Math.min(n,a),h=Math.max(n,a),f=1;if(l==="max")f=h>o?o/h:1;else if(l==="min")f=c<o?o/c:1;else if(l==="resize_long")f=o/h;else throw new Error(`Unsupported detection resize limitType: ${l}`);let g=Math.round(n*f),m=Math.round(a*f),w=Math.max(g,m);if(w>d){let v=d/w;g=Math.round(g*v),m=Math.round(m*v)}return g%32!==0&&(g=Math.max(Math.round(g/32)*32,32)),m%32!==0&&(m=Math.max(Math.round(m/32)*32,32)),{srcHeight:i,srcWidth:r,resizeSourceHeight:a,resizeSourceWidth:n,dstHeight:m,dstWidth:g,scaleWidth:g/n,scaleHeight:m/a}}var yo=class Wi{constructor(t,r,i={}){xe(this,"options",void 0),xe(this,"session",void 0),xe(this,"ortModule",void 0),this.session=r,this.ortModule=t,this.options={...qi,...i}}async run(t,r={}){let{onProgress:i,...n}=r,a=this.resolveRuntimeOptions(n),s=await this.preprocessDetection(t,a);i?.({type:"det",stage:"preprocess",progress:this.createProgress(1)});let o=await this.runInference(s.tensor,s.resizeParams);i?.({type:"det",stage:"infer",progress:this.createProgress(2)});let l=this.postprocessDetection(o,s,a);return i?.({type:"det",stage:"postprocess",progress:this.createProgress(3),detectedCount:l.length}),l}resolveRuntimeOptions(t={}){let r=t.inputShape??this.options.inputShape??this.resolveFixedInputShape(),i={...this.options,...t};return r?{...i,inputShape:r}:i}resolveFixedInputShape(){let t=Vi(this.session);if(!(!t.height||!t.width))return[t.channels??3,t.height,t.width]}createProgress(t){return{current:t,remain:Wi.TOTAL_PROGRESS_STEPS-t,total:Wi.TOTAL_PROGRESS_STEPS}}async preprocessDetection(t,r){return py(t,r)}async runInference(t,r){let i=new this.ortModule.Tensor("float32",t,[1,3,r.dstHeight,r.dstWidth]),n=await this.session.run(Fi(this.session,i)),a=this.session.outputNames[0]??Object.keys(n)[0],s=a?n[a]:void 0;if(!s)throw new Error(`Detection output tensor '${a??"<none>"}' not found. Available keys: ${Object.keys(n).join(", ")}`);let o=fy(s);return my(s,o,r),o}postprocessDetection(t,r,i){return jg(t,r,i)}};xe(yo,"TOTAL_PROGRESS_STEPS",3);function fy(e){if(!(e.data instanceof Float32Array))throw new Error("Detection output tensor must contain Float32Array data.");return e.data}function my(e,t,r){let[i,n,a,s]=e.dims;if(e.dims.length!==4||i!==1||!Number.isInteger(n)||n<1||a!==r.dstHeight||s!==r.dstWidth)throw new Error(`Detection output tensor shape [${e.dims.join(",")}] must be DB maps in [1,C,${r.dstHeight},${r.dstWidth}] layout.`);let o=i*n*a*s;if(t.length!==o)throw new Error(`Detection output tensor shape [${e.dims.join(",")}] does not match data length ${t.length}.`)}var nb={UVDoc:{name:"UVDoc",module:"text_image_unwarping",architecture:"UVDoc",options:{inputName:"img",mean:[0,0,0],stdDeviation:[1/255,1/255,1/255],channelOrder:"bgr",preprocessPipeline:["Read","Normalize","ToCHW","ToBatch"],postprocessName:"DocTr",outputScale:255,outputChannelOrder:"bgr",resultImageKey:"doctr_img",dynamicInputShape:{min:[1,3,128,64],opt:[1,3,256,128],max:[8,3,512,256]}}}};var gy={channelOrder:"bgr",outputSelectionStrategy:"ctc-logits",imageHeight:48,imageWidth:320},yy=["DecodeImage","MultiLabelEncode","RecResizeImg","KeepKeys"],ao={name:"ppocrv5",fileName:"ppocrv5_dict.txt",useSpaceChar:!0,dictionaryLength:18384,recognitionOutputClasses:18385},so={name:"ppocrv6",fileName:"ppocrv6_dict.txt",useSpaceChar:!0,dictionaryLength:18708,recognitionOutputClasses:18710},by={name:"ppocrv6_tiny",fileName:"ppocrv6_tiny_dict.txt",useSpaceChar:!0,dictionaryLength:6904,recognitionOutputClasses:6906};function Yt(e,t){return{name:e,module:"text_recognition",architecture:"CTC",inputName:"x",preprocessPipeline:yy,postprocessName:"CTCLabelDecode",dictionary:t,options:gy}}var ab={"PP-OCRv5_mobile_rec":Yt("PP-OCRv5_mobile_rec",ao),"PP-OCRv5_server_rec":Yt("PP-OCRv5_server_rec",ao),"PP-OCRv6_tiny_rec":Yt("PP-OCRv6_tiny_rec",by),"PP-OCRv6_small_rec":Yt("PP-OCRv6_small_rec",so),"PP-OCRv6_medium_rec":Yt("PP-OCRv6_medium_rec",so)};var wy=class{constructor(e,t,r={}){xe(this,"options",void 0),xe(this,"session",void 0),xe(this,"ortModule",void 0),this.session=t,this.ortModule=e,this.options={...Hi,...r}}async run(e,t,r){let i=this.resolveRuntimeOptions(r?.recognition),n=this.resolveOrderingOptions(r?.ordering),a=this.sortBoxesByReadingOrder(t.filter(h=>h.width>0&&h.height>0),n),s=this.calculateBatchMaxWhRatio(a,i),o=[],l=r?.charWhiteList?.length?new Set(r.charWhiteList):void 0,d=a.length,c=r?.onProgress;c?.({type:"rec",stage:"start",progress:this.createProgress(0,d)});for(let[h,f]of a.entries()){let g=await this.processBox({image:e,index:h,box:f,maxWhRatio:s,charWhiteSet:l,textlineOrientation:r?.textlineOrientation,textlineOrientationClassifier:r?.textlineOrientationClassifier},i);g&&o.push(g),c?.({type:"rec",stage:"item",progress:this.createProgress(h+1,d),index:h,box:f,result:g??void 0,textlineOrientation:g?.textlineOrientation})}return c?.({type:"rec",stage:"complete",progress:this.createProgress(d,d)}),o}resolveRuntimeOptions(e={}){return{...this.options,...e}}resolveOrderingOptions(e={}){return{...uo,...e}}async processBox(e,t){let{image:r,box:i}=e,n=i.points?r.cropRotated(i.points):r.crop(i),a=await this.correctTextlineOrientation(n,e);a?.rotated&&(n=n.rotate180());let s=Vi(this.session).width,o=Math.ceil(t.imageHeight*(n.width/n.height)),l=s??Math.max(t.imageWidth,o,Math.ceil(t.imageHeight*(e.maxWhRatio??0))),d=Math.min(o,l),c=n.resize({width:d,height:t.imageHeight}).tensor({mean_values:t.mean,norm_values:t.stdDeviation,channel_order:t.channelOrder}),h=this.padRecognitionTensor(c,d,t.imageHeight,l),f=new this.ortModule.Tensor("float32",h,[1,3,t.imageHeight,l]),{data:g,dims:m}=await this.runInference(f,t),[,w,v]=m,{text:x,confidence:b}=this.ctcLabelDecode(g,w,v,t,e.charWhiteSet);return{text:x,box:i,confidence:b,textlineOrientation:a}}async correctTextlineOrientation(e,t){let r=t.textlineOrientationClassifier;if(!r)return;let i={enabled:!0,threshold:.9,...t.textlineOrientation};if(!i.enabled)return;let n=(await r.run(e,i))[0];if(n)return{classId:n.classId,label:n.label,score:n.score,rotated:n.label.includes("180")&&n.score>i.threshold}}calculateBatchMaxWhRatio(e,t){let r=t.imageWidth/t.imageHeight;for(let i of e)r=Math.max(r,this.calculateBoxWhRatio(i));return r}calculateBoxWhRatio(e){if(!e.points)return e.width/e.height;let t=Math.max(this.distance(e.points[0],e.points[1]),this.distance(e.points[2],e.points[3]),1),r=Math.max(this.distance(e.points[0],e.points[3]),this.distance(e.points[1],e.points[2]),1);return r/t>=1.5?r/t:t/r}distance(e,t){return Math.hypot(e.x-t.x,e.y-t.y)}padRecognitionTensor(e,t,r,i){if(t===i)return e;let n=3,a=new Float32Array(n*r*i);for(let s=0;s<n;s++)for(let o=0;o<r;o++){let l=s*r*t+o*t,d=s*r*i+o*i;a.set(e.subarray(l,l+t),d)}return a}sortBoxesByReadingOrder(e,t){if(!t.sortByReadingOrder)return[...e];let r=[...e].sort((i,n)=>{let a=this.getBoxTopLeft(i),s=this.getBoxTopLeft(n);return a.y!==s.y?a.y-s.y:a.x-s.x});for(let i=0;i<r.length-1;i++)for(let n=i;n>=0;n--){let a=r[n],s=r[n+1];if(!a||!s)break;let o=this.getBoxTopLeft(a),l=this.getBoxTopLeft(s),d=this.resolveSameLineThreshold(a,s,t);if(Math.abs(l.y-o.y)<d&&l.x<o.x){r[n]=s,r[n+1]=a;continue}break}return r}getBoxTopLeft(e){return e.points?.[0]??e}resolveSameLineThreshold(e,t,r){return r.sameLineThresholdRatio!==void 0?(e.height+t.height)*r.sameLineThresholdRatio:r.sameLinePixelThreshold??10}createProgress(e,t){return{current:e,remain:t-e,total:t}}async runInference(e,t){let r=await this.session.run(Fi(this.session,e)),i=this.selectOutputTensor(r,t);if(!i)throw new Error(`Recognition output tensor not found. Available keys: ${Object.keys(r).join(", ")}`);return i}selectOutputTensor(e,t){if(t.outputSelectionStrategy!=="ctc-logits"){let i=Object.keys(e)[0];return i?e[i]:void 0}let r;for(let i of Object.keys(e)){let n=e[i],a=n?.dims;n?.data instanceof Float32Array&&a?.length===3&&(a[0]===1||a[0]===-1)&&(a[1]??0)>0&&(a[2]??0)>1&&(r=n)}if(r)return r;throw new Error(`Recognition CTC logits output not found. Available outputs: ${Object.entries(e).map(([i,n])=>`${i}[${n.dims.join(",")}]`).join(", ")}`)}ctcLabelDecode(e,t,r,i,n){let a=i.charactersDictionary,s=a[0]===""||a[0]==="blank",o=s?r:r-1;if(a.length<o)throw new Error(`Recognition charactersDictionary length ${a.length} is too small for model output classes ${r}. Expected at least ${o}${s?" including the CTC blank entry":""}.`);let l="",d=[],c=-1;for(let h=0;h<t;h++){let f=-1/0,g=0,m=h*r;for(let v=0;v<r;v++){let x=e[m+v];x>f&&(f=x,g=v)}if(g===c||(c=g,g===0))continue;let w=a[s?g:g-1]||"";n&&!n.has(w)&&w!==" "||(l+=w,d.push(f))}return{text:i.reverseText?_y(l):l,confidence:d.length>0?d.reduce((h,f)=>h+f,0)/d.length:0}}};function _y(e){let t=[],r="";for(let i of e){if(!/[a-zA-Z0-9 :*./%+-]/.test(i)){r&&t.push(r),t.push(i),r="";continue}r+=i}return r&&t.push(r),t.reverse().join("")}var Mi={channelOrder:"bgr",maxSideLength:960,limitType:"max",maxSideLimit:4e3,textPixelThreshold:.3,boxScoreThreshold:.6,maxCandidates:1e3,unclipRatio:1.5},Nr={channelOrder:"bgr",maxSideLength:736,limitType:"min",maxSideLimit:4e3,textPixelThreshold:.2,boxScoreThreshold:.45,maxCandidates:3e3,unclipRatio:1.4},xt={channelOrder:"bgr",outputSelectionStrategy:"ctc-logits",imageHeight:48,imageWidth:320},xy=18385,$y=18384,vy=18710,Sy=18708,Ty=6906,Iy=6904,Ai={name:"ppocrv5",fileName:"ppocrv5_dict.txt",useSpaceChar:!0,dictionaryLength:$y,recognitionOutputClasses:xy},Pi={name:"ppocrv6",fileName:"ppocrv6_dict.txt",useSpaceChar:!0,dictionaryLength:Sy,recognitionOutputClasses:vy},ky={name:"ppocrv6_tiny",fileName:"ppocrv6_tiny_dict.txt",useSpaceChar:!0,dictionaryLength:Iy,recognitionOutputClasses:Ty},Ey={"PP-OCRv5":{name:"PP-OCRv5",detection:Mi,recognition:xt,dictionary:Ai},"PP-OCRv5_mobile":{name:"PP-OCRv5_mobile",detection:Mi,recognition:xt,dictionary:Ai},"PP-OCRv5_server":{name:"PP-OCRv5_server",detection:Mi,recognition:xt,dictionary:Ai},"PP-OCRv6":{name:"PP-OCRv6",detection:Nr,recognition:xt,dictionary:Pi},"PP-OCRv6_tiny":{name:"PP-OCRv6_tiny",detection:{...Nr,boxScoreThreshold:.4},recognition:xt,dictionary:ky},"PP-OCRv6_small":{name:"PP-OCRv6_small",detection:Nr,recognition:xt,dictionary:Pi},"PP-OCRv6_medium":{name:"PP-OCRv6_medium",detection:Nr,recognition:xt,dictionary:Pi}};function bo(e){let t=Ey[e];if(!t)throw new Error(`Unsupported PaddleOCR model preset: ${e}`);return t}function Cy(e){if(!e)return{detection:{},recognition:{}};let t=bo(e);return{detection:{...t.detection},recognition:{...t.recognition}}}var Oy=class wo{constructor(t){if(xe(this,"options",void 0),xe(this,"detectionSession",null),xe(this,"detectionService",null),xe(this,"recognitionSession",null),xe(this,"recognitionService",null),xe(this,"textlineOrientationSession",null),xe(this,"textlineOrientationService",null),!t?.ort)throw new Error("PaddleOcrService requires the 'ort' option to be set with onnxruntime-node or onnxruntime-wen.");let r=Cy(t.modelPreset);this.options={...Ci,...r,...t||{},detection:{...Ci.detection,...r.detection,...t.detection},recognition:{...Ci.recognition,...r.recognition,...t.recognition},textlineOrientation:t.textlineOrientation?{...Zs,...t.textlineOrientation}:void 0}}async initialize(){let t=this.options.ort;if(!t)throw new Error("PaddleOcrService requires the 'ort' option to be set with onnxruntime-node or onnxruntime-wen.");let r=this.options.detection?.modelBuffer;if(!r)throw new Error("Detection model buffer is required. Please provide a valid ONNX model.");this.detectionSession=await t.InferenceSession.create(r);let{modelBuffer:i,...n}=this.options.detection??{};this.detectionService=new yo(t,this.detectionSession,n);let a=this.options.recognition?.modelBuffer;if(!a)throw new Error("Recognition model buffer is required. Please provide a valid ONNX model.");this.recognitionSession=await t.InferenceSession.create(a);let{modelBuffer:s,...o}=this.options.recognition??{};this.recognitionService=new wy(t,this.recognitionSession,o);let l=this.options.textlineOrientation?.modelBuffer;if(l){this.textlineOrientationSession=await t.InferenceSession.create(l);let{modelBuffer:d,enabled:c,threshold:h,...f}=this.options.textlineOrientation??{};this.textlineOrientationService=new gg(t,this.textlineOrientationSession,f)}}isInitialized(){return this.detectionSession!==null&&this.recognitionSession!==null}static async createInstance(t){let r=new wo(t);return await r.initialize(),r}resolveDetectionRuntimeOptions(t={}){let{modelBuffer:r,...i}=this.options.detection??{};return{...qi,...i,...t}}resolveRecognitionRuntimeOptions(t={}){let{modelBuffer:r,...i}=this.options.recognition??{};return{...Hi,...i,...t}}resolveRecognitionOrderingOptions(t={}){return{...uo,...t}}resolveTextlineOrientationOptions(t){if(!this.options.textlineOrientation&&!t)return;let{modelBuffer:r,...i}=this.options.textlineOrientation??{};return{...Zs,...i,...t}}formatDictionaryRequirement(t){let{dictionary:r}=t;return` The ${t.name} preset expects ${r.fileName} with ${r.dictionaryLength} entries and ${r.recognitionOutputClasses} CTC output classes.`}async recognize(t,r){if(!this.detectionService||!this.recognitionService)throw new Error("PaddleOcrService is not initialized. Please call initialize() first.");let i=this.resolveDetectionRuntimeOptions(r?.detection),n=this.resolveRecognitionRuntimeOptions(r?.recognition),a=this.resolveRecognitionOrderingOptions(r?.ordering),s=this.resolveTextlineOrientationOptions(r?.textlineOrientation);if(s?.enabled&&!this.textlineOrientationService)throw new Error("Textline orientation correction requires textlineOrientation.modelBuffer in createInstance().");if(!n.charactersDictionary?.length){let h=this.options.modelPreset?bo(this.options.modelPreset):void 0;throw new Error(`Recognition charactersDictionary is required. Provide it in createInstance({ recognition }) or recognize(_, { recognition }).${h?this.formatDictionaryRequirement(h):""}`)}let o=lo(t),l=i.padding;l&&(o=o.padding({padding:l,color:[255,255,255]}));let d=await this.detectionService.run(o,{...i,onProgress:r?.onProgress}),c={...r,detection:i,recognition:n,ordering:a};return s&&(c.textlineOrientation=s),this.textlineOrientationService&&(c.textlineOrientationClassifier=this.textlineOrientationService),await this.recognitionService.run(o,d,c)}processRecognition(t,r){let i={text:"",lines:[],confidence:0},n={...Qs,...r},a=n.recognitionScoreThreshold??Qs.recognitionScoreThreshold,s=t.filter(c=>c.confidence>=a);if(!s.length)return i;i.confidence=s.reduce((c,h)=>c+h.confidence,0)/s.length;let o=[s[0]],l=s[0].text,d=s[0].box.height;for(let c=1;c<s.length;c++){let h=s[c],f=s[c-1];Math.abs(h.box.y-f.box.y)<=d*n.lineMergeThresholdRatio?(o.push(h),l+=` ${h.text}`,d=o.reduce((g,m)=>g+m.box.height,0)/o.length):(i.lines.push([...o]),l+=`
${h.text}`,o=[h],d=h.box.height)}return o.length>0&&i.lines.push([...o]),i.text=l,i}async destroy(){await this.detectionSession?.release(),await this.recognitionSession?.release()}};var Nf={};sg(Nf,{InferenceSession:()=>ca,TRACE:()=>br,TRACE_FUNC_BEGIN:()=>Xe,TRACE_FUNC_END:()=>We,Tensor:()=>Ke,default:()=>Y0,env:()=>ge,registerBackend:()=>Ot});var la=Object.defineProperty,zy=Object.getOwnPropertyDescriptor,Ry=Object.getOwnPropertyNames,My=Object.prototype.hasOwnProperty,Ay=(e=>typeof wt<"u"?wt:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof wt<"u"?wt:t)[r]}):e)(function(e){if(typeof wt<"u")return wt.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),D=(e,t)=>()=>(e&&(t=e(e=0)),t),Ft=(e,t)=>{for(var r in t)la(e,r,{get:t[r],enumerable:!0})},Py=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of Ry(t))!My.call(e,n)&&n!==r&&la(e,n,{get:()=>t[n],enumerable:!(i=zy(t,n))||i.enumerable});return e},yr=e=>Py(la({},"__esModule",{value:!0}),e),tr,ht,Ot,_o,Qd,Jd=D(()=>{"use strict";tr=new Map,ht=[],Ot=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=tr.get(e);if(i===void 0)tr.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let n=ht.indexOf(e);n!==-1&&ht.splice(n,1);for(let a=0;a<ht.length;a++)if(tr.get(ht[a]).priority<=r){ht.splice(a,0,e);return}ht.push(e)}return}throw new TypeError("not a valid backend")},_o=async e=>{let t=tr.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},Qd=async e=>{let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),i=r.length===0?ht:r,n,a=[],s=new Set;for(let l of i){let d=await _o(l);typeof d=="string"?a.push({name:l,err:d}):(n||(n=d),n===d&&s.add(l))}if(!n)throw new Error(`no available backend found. ERR: ${a.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:d}of a)r.includes(l)&&console.warn(`removing requested execution provider "${l}" from session options because it is not available: ${d}`);let o=t.filter(l=>s.has(typeof l=="string"?l:l.name));return[n,new Proxy(e,{get:(l,d)=>d==="executionProviders"?o:Reflect.get(l,d)})]}}),Ny=D(()=>{"use strict";Jd()}),ec,By=D(()=>{"use strict";ec="1.22.0"}),Gi,Ue,tc=D(()=>{"use strict";By(),Gi="warning",Ue={wasm:{},webgl:{},webgpu:{},versions:{common:ec},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);Gi=e}},get logLevel(){return Gi}},Object.defineProperty(Ue,"logLevel",{enumerable:!0})}),ge,Dy=D(()=>{"use strict";tc(),ge=Ue}),rc,ic,Ly=D(()=>{"use strict";rc=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let n,a;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[3]):(n=e.dims[3],a=e.dims[2]);let s=t?.format!==void 0?t.format:"RGB",o=t?.norm,l,d;o===void 0||o.mean===void 0?l=[255,255,255,255]:typeof o.mean=="number"?l=[o.mean,o.mean,o.mean,o.mean]:(l=[o.mean[0],o.mean[1],o.mean[2],0],o.mean[3]!==void 0&&(l[3]=o.mean[3])),o===void 0||o.bias===void 0?d=[0,0,0,0]:typeof o.bias=="number"?d=[o.bias,o.bias,o.bias,o.bias]:(d=[o.bias[0],o.bias[1],o.bias[2],0],o.bias[3]!==void 0&&(d[3]=o.bias[3]));let c=a*n,h=0,f=c,g=c*2,m=-1;s==="RGBA"?(h=0,f=c,g=c*2,m=c*3):s==="RGB"?(h=0,f=c,g=c*2):s==="RBG"&&(h=0,g=c,f=c*2);for(let w=0;w<a;w++)for(let v=0;v<n;v++){let x=(e.data[h++]-d[0])*l[0],b=(e.data[f++]-d[1])*l[1],S=(e.data[g++]-d[2])*l[2],T=m===-1?255:(e.data[m++]-d[3])*l[3];i.fillStyle="rgba("+x+","+b+","+S+","+T+")",i.fillRect(v,w,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},ic=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let n,a,s;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[1],s=e.dims[3]):(n=e.dims[3],a=e.dims[2],s=e.dims[1]);let o=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t?.norm,d,c;l===void 0||l.mean===void 0?d=[255,255,255,255]:typeof l.mean=="number"?d=[l.mean,l.mean,l.mean,l.mean]:(d=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(d[3]=l.mean[3])),l===void 0||l.bias===void 0?c=[0,0,0,0]:typeof l.bias=="number"?c=[l.bias,l.bias,l.bias,l.bias]:(c=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(c[3]=l.bias[3]));let h=a*n;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let f=4,g=0,m=1,w=2,v=3,x=0,b=h,S=h*2,T=-1;o==="RGBA"?(x=0,b=h,S=h*2,T=h*3):o==="RGB"?(x=0,b=h,S=h*2):o==="RBG"&&(x=0,S=h,b=h*2),i=r.createImageData(n,a);for(let I=0;I<a*n;g+=f,m+=f,w+=f,v+=f,I++)i.data[g]=(e.data[x++]-c[0])*d[0],i.data[m]=(e.data[b++]-c[1])*d[1],i.data[w]=(e.data[S++]-c[2])*d[2],i.data[v]=T===-1?255:(e.data[T++]-c[3])*d[3]}else throw new Error("Can not access image data");return i}}),Dr,nc,ac,sc,oc,uc,Uy=D(()=>{"use strict";da(),Dr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,n=t.norm??{mean:255,bias:0},a,s;typeof n.mean=="number"?a=[n.mean,n.mean,n.mean,n.mean]:a=[n.mean[0],n.mean[1],n.mean[2],n.mean[3]??255],typeof n.bias=="number"?s=[n.bias,n.bias,n.bias,n.bias]:s=[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??0];let o=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",d=r*i,c=l==="RGBA"?new Float32Array(d*4):new Float32Array(d*3),h=4,f=0,g=1,m=2,w=3,v=0,x=d,b=d*2,S=-1;o==="RGB"&&(h=3,f=0,g=1,m=2,w=-1),l==="RGBA"?S=d*3:l==="RBG"?(v=0,b=d,x=d*2):l==="BGR"&&(b=0,x=d,v=d*2);for(let T=0;T<d;T++,f+=h,m+=h,g+=h,w+=h)c[v++]=(e[f]+s[0])/a[0],c[x++]=(e[g]+s[1])/a[1],c[b++]=(e[m]+s[2])/a[2],S!==-1&&w!==-1&&(c[S++]=(e[w]+s[3])/a[3]);return l==="RGBA"?new Ae("float32",c,[1,4,r,i]):new Ae("float32",c,[1,3,r,i])},nc=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,n=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,a=typeof e=="string",s,o=t??{},l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},d=c=>typeof HTMLCanvasElement<"u"&&c instanceof HTMLCanvasElement||c instanceof OffscreenCanvas?c.getContext("2d"):null;if(r){let c=l();c.width=e.width,c.height=e.height;let h=d(c);if(h!=null){let f=e.height,g=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(f=t.resizedHeight,g=t.resizedWidth),t!==void 0){if(o=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");o.tensorFormat="RGBA",o.height=f,o.width=g}else o.tensorFormat="RGBA",o.height=f,o.width=g;h.drawImage(e,0,0),s=h.getImageData(0,0,g,f).data}else throw new Error("Can not access image data")}else if(i){let c,h;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(c=t.resizedHeight,h=t.resizedWidth):(c=e.height,h=e.width),t!==void 0&&(o=t),o.format="RGBA",o.height=c,o.width=h,t!==void 0){let f=l();f.width=h,f.height=c;let g=d(f);if(g!=null)g.putImageData(e,0,0),s=g.getImageData(0,0,h,c).data;else throw new Error("Can not access image data")}else s=e.data}else if(n){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let c=l();c.width=e.width,c.height=e.height;let h=d(c);if(h!=null){let f=e.height,g=e.width;return h.drawImage(e,0,0,g,f),s=h.getImageData(0,0,g,f).data,o.height=f,o.width=g,Dr(s,o)}else throw new Error("Can not access image data")}else{if(a)return new Promise((c,h)=>{let f=l(),g=d(f);if(!e||!g)return h();let m=new Image;m.crossOrigin="Anonymous",m.src=e,m.onload=()=>{f.width=m.width,f.height=m.height,g.drawImage(m,0,0,f.width,f.height);let w=g.getImageData(0,0,f.width,f.height);o.height=f.height,o.width=f.width,c(Dr(w.data,o))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return Dr(s,o);throw new Error("Input data provided is not supported - aborted tensor creation")},ac=(e,t)=>{let{width:r,height:i,download:n,dispose:a}=t,s=[1,i,r,4];return new Ae({location:"texture",type:"float32",texture:e,dims:s,download:n,dispose:a})},sc=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:a}=t;return new Ae({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:n,dispose:a})},oc=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:a}=t;return new Ae({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:n,dispose:a})},uc=(e,t,r)=>new Ae({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),kt,pr,ji,lc,Wy=D(()=>{"use strict";kt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),pr=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),ji=!1,lc=()=>{if(!ji){ji=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(kt.set("int64",BigInt64Array),pr.set(BigInt64Array,"int64")),t&&(kt.set("uint64",BigUint64Array),pr.set(BigUint64Array,"uint64")),i?(kt.set("float16",r),pr.set(r,"float16")):kt.set("float16",Uint16Array)}}}),dc,cc,qy=D(()=>{"use strict";da(),dc=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},cc=(e,t)=>{switch(e.location){case"cpu":return new Ae(e.type,e.data,t);case"cpu-pinned":return new Ae({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Ae({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Ae({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Ae({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Ae,da=D(()=>{"use strict";Ly(),Uy(),Wy(),qy(),Ae=class{constructor(e,t,r){lc();let i,n;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,n=e.dims,e.location){case"cpu-pinned":{let s=kt.get(i);if(!s)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,o;if(typeof e=="string")if(i=e,o=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let l=kt.get(e);if(l===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&l===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);e==="uint64"||e==="int64"?s=l.from(t,BigInt):s=l.from(t)}else if(t instanceof l)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&l!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${l}`)}else if(o=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")i="string",s=e;else if(l==="boolean")i="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",s=Uint8Array.from(e);else{let l=pr.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=l,s=e}if(o===void 0)o=[s.length];else if(!Array.isArray(o))throw new TypeError("A tensor's dims must be a number array");n=o,this.cpuData=s,this.dataLocation="cpu"}let a=dc(n);if(this.cpuData&&a!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(a/2)===this.cpuData.length))throw new Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=n,this.size=a}static async fromImage(e,t){return nc(e,t)}static fromTexture(e,t){return ac(e,t)}static fromGpuBuffer(e,t){return sc(e,t)}static fromMLTensor(e,t){return oc(e,t)}static fromPinnedBuffer(e,t,r){return uc(e,t,r)}toDataURL(e){return rc(this,e)}toImageData(e){return ic(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return cc(this,e)}}}),Ke,pc=D(()=>{"use strict";da(),Ke=Ae}),br,Ki,Xe,We,hc=D(()=>{"use strict";tc(),br=(e,t)=>{(typeof Ue.trace>"u"?!Ue.wasm.trace:!Ue.trace)||console.timeStamp(`${e}::ORT::${t}`)},Ki=(e,t)=>{let r=new Error().stack?.split(/\r\n|\r|\n/g)||[],i=!1;for(let n=0;n<r.length;n++){if(i&&!r[n].includes("TRACE_FUNC")){let a=`FUNC_${e}::${r[n].trim().split(" ")[1]}`;t&&(a+=`::${t}`),br("CPU",a);return}r[n].includes("TRACE_FUNC")&&(i=!0)}},Xe=e=>{(typeof Ue.trace>"u"?!Ue.wasm.trace:!Ue.trace)||Ki("BEGIN",e)},We=e=>{(typeof Ue.trace>"u"?!Ue.wasm.trace:!Ue.trace)||Ki("END",e)}}),fc,Hy=D(()=>{"use strict";Jd(),pc(),hc(),fc=class mc{constructor(t){this.handler=t}async run(t,r,i){Xe();let n={},a={};if(typeof t!="object"||t===null||t instanceof Ke||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof Ke)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let d of r){if(typeof d!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(d)===-1)throw new RangeError(`'fetches' contains invalid output name: ${d}.`);n[d]=null}if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let d=!1,c=Object.getOwnPropertyNames(r);for(let h of this.outputNames)if(c.indexOf(h)!==-1){let f=r[h];(f===null||f instanceof Ke)&&(d=!0,s=!1,n[h]=f)}if(d){if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else a=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let d of this.inputNames)if(typeof t[d]>"u")throw new Error(`input '${d}' is missing in 'feeds'.`);if(s)for(let d of this.outputNames)n[d]=null;let o=await this.handler.run(t,n,a),l={};for(let d in o)if(Object.hasOwnProperty.call(o,d)){let c=o[d];c instanceof Ke?l[d]=c:l[d]=new Ke(c.type,c.data,c.dims)}return We(),l}async release(){return this.handler.dispose()}static async create(t,r,i,n){Xe();let a,s={};if(typeof t=="string"){if(a=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(a=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let c=t,h=0,f=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(h=r,!Number.isSafeInteger(h))throw new RangeError("'byteOffset' must be an integer.");if(h<0||h>=c.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${c.byteLength}).`);if(f=t.byteLength-h,typeof i=="number"){if(f=i,!Number.isSafeInteger(f))throw new RangeError("'byteLength' must be an integer.");if(f<=0||h+f>c.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${c.byteLength-h}].`);if(typeof n=="object"&&n!==null)s=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");a=new Uint8Array(c,h,f)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[o,l]=await Qd(s),d=await o.createInferenceSessionHandler(a,l);return We(),new mc(d)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),ca,Fy=D(()=>{"use strict";Hy(),ca=fc}),Vy=D(()=>{"use strict"}),Gy=D(()=>{"use strict"}),jy=D(()=>{"use strict"}),Ky=D(()=>{"use strict"}),gc={};Ft(gc,{InferenceSession:()=>ca,TRACE:()=>br,TRACE_FUNC_BEGIN:()=>Xe,TRACE_FUNC_END:()=>We,Tensor:()=>Ke,env:()=>ge,registerBackend:()=>Ot});var Ye=D(()=>{"use strict";Ny(),Dy(),Fy(),pc(),Vy(),Gy(),hc(),jy(),Ky()}),pa=D(()=>{"use strict"}),yc={};Ft(yc,{default:()=>bc});var Xi,Yi,bc,Xy=D(()=>{"use strict";Sf(),At(),ha(),Xi="ort-wasm-proxy-worker",Yi=globalThis.self?.name===Xi,Yi&&(self.onmessage=e=>{let{type:t,in:r}=e.data;try{switch(t){case"init-wasm":fa(r.wasm).then(()=>{za(r).then(()=>{postMessage({type:t})},i=>{postMessage({type:t,err:i})})},i=>{postMessage({type:t,err:i})});break;case"init-ep":{let{epName:i,env:n}=r;Ra(n,i).then(()=>{postMessage({type:t})},a=>{postMessage({type:t,err:a})});break}case"copy-from":{let{buffer:i}=r,n=ai(i);postMessage({type:t,out:n});break}case"create":{let{model:i,options:n}=r;Ma(i,n).then(a=>{postMessage({type:t,out:a})},a=>{postMessage({type:t,err:a})});break}case"release":Aa(r),postMessage({type:t});break;case"run":{let{sessionId:i,inputIndices:n,inputs:a,outputIndices:s,options:o}=r;Pa(i,n,a,s,new Array(s.length).fill(null),o).then(l=>{l.some(d=>d[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:l},Ba([...a,...l]))},l=>{postMessage({type:t,err:l})});break}case"end-profiling":Na(r),postMessage({type:t});break;default:}}catch(i){postMessage({type:t,err:i})}}),bc=Yi?null:e=>new Worker(e??Me,{type:"module",name:Xi})}),wc={};Ft(wc,{default:()=>_c});var Zi,Qi,_c,xo,Yy=D(()=>{"use strict";Qi=(Zi=import.meta.url,async function(e={}){var t,r,i=e,n=new Promise((u,p)=>{t=u,r=p}),a=typeof window=="object",s=typeof WorkerGlobalScope<"u",o=s&&self.name?.startsWith("em-pthread");i.mountExternalData=(u,p)=>{u.startsWith("./")&&(u=u.substring(2)),(i.Fb||(i.Fb=new Map)).set(u,p)},i.unmountExternalData=()=>{delete i.Fb};var l=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,qc:!0}).buffer.constructor;let d=u=>async(...p)=>{try{if(i.Gb)throw Error("Session already started");let y=i.Gb={ec:p[0],errors:[]},_=await u(...p);if(i.Gb!==y)throw Error("Session mismatch");i.Kb?.flush();let $=y.errors;if(0<$.length){let E=await Promise.all($);if(E=E.filter(M=>M),0<E.length)throw Error(E.join(`
`))}return _}finally{i.Gb=null}};i.jsepInit=(u,p)=>{if(u==="webgpu"){[i.Kb,i.Vb,i.Zb,i.Lb,i.Yb,i.kb,i.$b,i.bc,i.Wb,i.Xb,i.ac]=p;let y=i.Kb;i.jsepRegisterBuffer=(_,$,E,M)=>y.registerBuffer(_,$,E,M),i.jsepGetBuffer=_=>y.getBuffer(_),i.jsepCreateDownloader=(_,$,E)=>y.createDownloader(_,$,E),i.jsepOnCreateSession=_=>{y.onCreateSession(_)},i.jsepOnReleaseSession=_=>{y.onReleaseSession(_)},i.jsepOnRunStart=_=>y.onRunStart(_),i.cc=(_,$)=>{y.upload(_,$)}}else if(u==="webnn"){let y=p[0];[i.oc,i.Ob,i.webnnEnsureTensor,i.Pb,i.webnnDownloadTensor]=p.slice(1),i.webnnReleaseTensorId=i.Ob,i.webnnUploadTensor=i.Pb,i.webnnOnRunStart=_=>y.onRunStart(_),i.webnnOnRunEnd=y.onRunEnd.bind(y),i.webnnRegisterMLContext=(_,$)=>{y.registerMLContext(_,$)},i.webnnOnReleaseSession=_=>{y.onReleaseSession(_)},i.webnnCreateMLTensorDownloader=(_,$)=>y.createMLTensorDownloader(_,$),i.webnnRegisterMLTensor=(_,$,E,M)=>y.registerMLTensor(_,$,E,M),i.webnnCreateMLContext=_=>y.createMLContext(_),i.webnnRegisterMLConstant=(_,$,E,M,B,q)=>y.registerMLConstant(_,$,E,M,B,i.Fb,q),i.webnnRegisterGraphInput=y.registerGraphInput.bind(y),i.webnnIsGraphInput=y.isGraphInput.bind(y),i.webnnRegisterGraphOutput=y.registerGraphOutput.bind(y),i.webnnIsGraphOutput=y.isGraphOutput.bind(y),i.webnnCreateTemporaryTensor=y.createTemporaryTensor.bind(y),i.webnnIsGraphInputOutputTypeSupported=y.isGraphInputOutputTypeSupported.bind(y)}};let c=()=>{let u=(p,y,_)=>(...$)=>{let E=Qe,M=y?.();$=p(...$);let B=y?.();return M!==B&&(p=B,_(M),y=_=null),Qe!=E?new Promise((q,K)=>{xi={resolve:q,reject:K}}):$};(()=>{for(let p of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])i[p]=u(i[p],()=>i[p],y=>i[p]=y)})(),d!==void 0&&(i._OrtRun=d(i._OrtRun),i._OrtRunWithBinding=d(i._OrtRunWithBinding)),c=void 0};i.asyncInit=()=>{c?.()};var h,f,g=Object.assign({},i),m=(u,p)=>{throw p},w="";(a||s)&&(s?w=self.location.href:typeof document<"u"&&document.currentScript&&(w=document.currentScript.src),Zi&&(w=Zi),w=w.startsWith("blob:")?"":w.slice(0,w.replace(/[?#].*/,"").lastIndexOf("/")+1),s&&(f=u=>{var p=new XMLHttpRequest;return p.open("GET",u,!1),p.responseType="arraybuffer",p.send(null),new Uint8Array(p.response)}),h=async u=>{if(j(u))return new Promise((y,_)=>{var $=new XMLHttpRequest;$.open("GET",u,!0),$.responseType="arraybuffer",$.onload=()=>{$.status==200||$.status==0&&$.response?y($.response):_($.status)},$.onerror=_,$.send(null)});var p=await fetch(u,{credentials:"same-origin"});if(p.ok)return p.arrayBuffer();throw Error(p.status+" : "+p.url)});var v=console.log.bind(console),x=console.error.bind(console),b=v,S=x;Object.assign(i,g),g=null;var T,I,C,k,O,N,L,X,F,ee,U,re,Z,H=i.wasmBinary,oe=!1,j=u=>u.startsWith("file://");function ue(){return T.buffer!=k.buffer&&ze(),k}function P(){return T.buffer!=k.buffer&&ze(),O}function W(){return T.buffer!=k.buffer&&ze(),N}function te(){return T.buffer!=k.buffer&&ze(),L}function R(){return T.buffer!=k.buffer&&ze(),X}function ie(){return T.buffer!=k.buffer&&ze(),F}function Ee(){return T.buffer!=k.buffer&&ze(),ee}function Ne(){return T.buffer!=k.buffer&&ze(),Z}if(o){let u=function(p){try{var y=p.data,_=y.Cb;if(_==="load"){let $=[];self.onmessage=E=>$.push(E),self.startWorker=()=>{postMessage({Cb:"loaded"});for(let E of $)u(E);self.onmessage=u};for(let E of y.Sb)i[E]&&!i[E].proxy||(i[E]=(...M)=>{postMessage({Cb:"callHandler",Rb:E,args:M})},E=="print"&&(b=i[E]),E=="printErr"&&(S=i[E]));T=y.lc,ze(),be(y.mc)}else if(_==="run"){Lf(y.Bb),Ti(y.Bb,0,0,1,0,0),Va(),wi(y.Bb),Re||(Ls(),Re=!0);try{Uf(y.hc,y.Ib)}catch($){if($!="unwind")throw $}}else y.target!=="setimmediate"&&(_==="checkMailbox"?Re&&xr():_&&(S(`worker: received unknown command ${_}`),S(y)))}catch($){throw Us(),$}};var ve=u,be,Re=!1;S=function(...p){p=p.join(" "),console.error(p)},self.alert=function(...p){postMessage({Cb:"alert",text:p.join(" "),jc:Cr()})},self.onunhandledrejection=p=>{throw p.reason||p},self.onmessage=u}function ze(){var u=T.buffer;i.HEAP8=k=new Int8Array(u),i.HEAP16=N=new Int16Array(u),i.HEAPU8=O=new Uint8Array(u),i.HEAPU16=L=new Uint16Array(u),i.HEAP32=X=new Int32Array(u),i.HEAPU32=F=new Uint32Array(u),i.HEAPF32=ee=new Float32Array(u),i.HEAPF64=Z=new Float64Array(u),i.HEAP64=U=new BigInt64Array(u),i.HEAPU64=re=new BigUint64Array(u)}function _r(){o?startWorker(i):Q.Da()}o||(T=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),ze());var oi,Vt=0,Gt=null;function Da(){if(--Vt==0&&Gt){var u=Gt;Gt=null,u()}}function ot(u){throw S(u="Aborted("+u+")"),oe=!0,u=new WebAssembly.RuntimeError(u+". Build with -sASSERTIONS for more info."),r(u),u}function La(){return{a:{L:Df,Aa:Bf,b:qf,$:Xa,A:Qa,pa:Ja,X:ts,Z:rs,qa:is,na:ns,ga:as,ma:ss,J:os,Y:us,V:ls,oa:ds,W:cs,va:Hf,E:Vf,Q:Gf,O:Kf,D:Yf,v:Zf,r:Qf,P:Jf,z:sm,R:om,ja:um,T:lm,aa:dm,M:cm,F:pm,ia:wi,sa:hm,t:fm,Ca:mm,w:bm,o:wm,m:xm,c:gi,Ba:$m,n:vm,j:Im,u:km,p:Em,f:Cm,s:Om,l:zm,e:Rm,k:Mm,h:Am,g:Pm,d:Nm,da:Bm,ea:Dm,fa:Lm,ba:Ts,ca:Is,N:ks,xa:Wm,ua:Fm,i:Vm,C:Gm,G:jm,ta:qm,x:Km,ra:Xm,U:Ym,q:Um,y:Zm,K:Qm,S:Jm,za:eg,ya:tg,ka:zs,la:Rs,_:pi,B:Ms,I:As,ha:Ps,H:Ns,a:T,wa:ci}}}var ui={840156:(u,p,y,_,$)=>{if(i===void 0||!i.Fb)return 1;if((u=$e(Number(u>>>0))).startsWith("./")&&(u=u.substring(2)),!(u=i.Fb.get(u)))return 2;if(p=Number(p>>>0),y=Number(y>>>0),_=Number(_>>>0),p+y>u.byteLength)return 3;try{let E=u.subarray(p,p+y);switch($){case 0:P().set(E,_>>>0);break;case 1:i.nc?i.nc(_,E):i.cc(_,E);break;default:return 4}return 0}catch{return 4}},840980:(u,p,y)=>{i.Pb(u,P().subarray(p>>>0,p+y>>>0))},841044:()=>i.oc(),841086:u=>{i.Ob(u)},841123:()=>{i.Wb()},841154:()=>{i.Xb()},841183:()=>{i.ac()},841208:u=>i.Vb(u),841241:u=>i.Zb(u),841273:(u,p,y)=>{i.Lb(Number(u),Number(p),Number(y),!0)},841336:(u,p,y)=>{i.Lb(Number(u),Number(p),Number(y))},841393:()=>typeof wasmOffsetConverter<"u",841450:u=>{i.kb("Abs",u,void 0)},841501:u=>{i.kb("Neg",u,void 0)},841552:u=>{i.kb("Floor",u,void 0)},841605:u=>{i.kb("Ceil",u,void 0)},841657:u=>{i.kb("Reciprocal",u,void 0)},841715:u=>{i.kb("Sqrt",u,void 0)},841767:u=>{i.kb("Exp",u,void 0)},841818:u=>{i.kb("Erf",u,void 0)},841869:u=>{i.kb("Sigmoid",u,void 0)},841924:(u,p,y)=>{i.kb("HardSigmoid",u,{alpha:p,beta:y})},842003:u=>{i.kb("Log",u,void 0)},842054:u=>{i.kb("Sin",u,void 0)},842105:u=>{i.kb("Cos",u,void 0)},842156:u=>{i.kb("Tan",u,void 0)},842207:u=>{i.kb("Asin",u,void 0)},842259:u=>{i.kb("Acos",u,void 0)},842311:u=>{i.kb("Atan",u,void 0)},842363:u=>{i.kb("Sinh",u,void 0)},842415:u=>{i.kb("Cosh",u,void 0)},842467:u=>{i.kb("Asinh",u,void 0)},842520:u=>{i.kb("Acosh",u,void 0)},842573:u=>{i.kb("Atanh",u,void 0)},842626:u=>{i.kb("Tanh",u,void 0)},842678:u=>{i.kb("Not",u,void 0)},842729:(u,p,y)=>{i.kb("Clip",u,{min:p,max:y})},842798:u=>{i.kb("Clip",u,void 0)},842850:(u,p)=>{i.kb("Elu",u,{alpha:p})},842908:u=>{i.kb("Gelu",u,void 0)},842960:u=>{i.kb("Relu",u,void 0)},843012:(u,p)=>{i.kb("LeakyRelu",u,{alpha:p})},843076:(u,p)=>{i.kb("ThresholdedRelu",u,{alpha:p})},843146:(u,p)=>{i.kb("Cast",u,{to:p})},843204:u=>{i.kb("Add",u,void 0)},843255:u=>{i.kb("Sub",u,void 0)},843306:u=>{i.kb("Mul",u,void 0)},843357:u=>{i.kb("Div",u,void 0)},843408:u=>{i.kb("Pow",u,void 0)},843459:u=>{i.kb("Equal",u,void 0)},843512:u=>{i.kb("Greater",u,void 0)},843567:u=>{i.kb("GreaterOrEqual",u,void 0)},843629:u=>{i.kb("Less",u,void 0)},843681:u=>{i.kb("LessOrEqual",u,void 0)},843740:(u,p,y,_,$)=>{i.kb("ReduceMean",u,{keepDims:!!p,noopWithEmptyAxes:!!y,axes:_?Array.from(R().subarray(Number(_)>>>0,Number($)>>>0)):[]})},843915:(u,p,y,_,$)=>{i.kb("ReduceMax",u,{keepDims:!!p,noopWithEmptyAxes:!!y,axes:_?Array.from(R().subarray(Number(_)>>>0,Number($)>>>0)):[]})},844089:(u,p,y,_,$)=>{i.kb("ReduceMin",u,{keepDims:!!p,noopWithEmptyAxes:!!y,axes:_?Array.from(R().subarray(Number(_)>>>0,Number($)>>>0)):[]})},844263:(u,p,y,_,$)=>{i.kb("ReduceProd",u,{keepDims:!!p,noopWithEmptyAxes:!!y,axes:_?Array.from(R().subarray(Number(_)>>>0,Number($)>>>0)):[]})},844438:(u,p,y,_,$)=>{i.kb("ReduceSum",u,{keepDims:!!p,noopWithEmptyAxes:!!y,axes:_?Array.from(R().subarray(Number(_)>>>0,Number($)>>>0)):[]})},844612:(u,p,y,_,$)=>{i.kb("ReduceL1",u,{keepDims:!!p,noopWithEmptyAxes:!!y,axes:_?Array.from(R().subarray(Number(_)>>>0,Number($)>>>0)):[]})},844785:(u,p,y,_,$)=>{i.kb("ReduceL2",u,{keepDims:!!p,noopWithEmptyAxes:!!y,axes:_?Array.from(R().subarray(Number(_)>>>0,Number($)>>>0)):[]})},844958:(u,p,y,_,$)=>{i.kb("ReduceLogSum",u,{keepDims:!!p,noopWithEmptyAxes:!!y,axes:_?Array.from(R().subarray(Number(_)>>>0,Number($)>>>0)):[]})},845135:(u,p,y,_,$)=>{i.kb("ReduceSumSquare",u,{keepDims:!!p,noopWithEmptyAxes:!!y,axes:_?Array.from(R().subarray(Number(_)>>>0,Number($)>>>0)):[]})},845315:(u,p,y,_,$)=>{i.kb("ReduceLogSumExp",u,{keepDims:!!p,noopWithEmptyAxes:!!y,axes:_?Array.from(R().subarray(Number(_)>>>0,Number($)>>>0)):[]})},845495:u=>{i.kb("Where",u,void 0)},845548:(u,p,y)=>{i.kb("Transpose",u,{perm:p?Array.from(R().subarray(Number(p)>>>0,Number(y)>>>0)):[]})},845672:(u,p,y,_)=>{i.kb("DepthToSpace",u,{blocksize:p,mode:$e(y),format:_?"NHWC":"NCHW"})},845805:(u,p,y,_)=>{i.kb("DepthToSpace",u,{blocksize:p,mode:$e(y),format:_?"NHWC":"NCHW"})},845938:(u,p,y,_,$,E,M,B,q,K,se,de,fe,Ie,Dt)=>{i.kb("ConvTranspose",u,{format:q?"NHWC":"NCHW",autoPad:p,dilations:[y],group:_,kernelShape:[$],pads:[E,M],strides:[B],wIsConst:()=>!!ue()[K>>>0],outputPadding:se?Array.from(R().subarray(Number(se)>>>0,Number(de)>>>0)):[],outputShape:fe?Array.from(R().subarray(Number(fe)>>>0,Number(Ie)>>>0)):[],activation:$e(Dt)})},846371:(u,p,y,_,$,E,M,B,q,K,se,de,fe,Ie)=>{i.kb("ConvTranspose",u,{format:B?"NHWC":"NCHW",autoPad:p,dilations:Array.from(R().subarray(Number(y)>>>0,2+(Number(y)>>>0)>>>0)),group:_,kernelShape:Array.from(R().subarray(Number($)>>>0,2+(Number($)>>>0)>>>0)),pads:Array.from(R().subarray(Number(E)>>>0,4+(Number(E)>>>0)>>>0)),strides:Array.from(R().subarray(Number(M)>>>0,2+(Number(M)>>>0)>>>0)),wIsConst:()=>!!ue()[q>>>0],outputPadding:K?Array.from(R().subarray(Number(K)>>>0,Number(se)>>>0)):[],outputShape:de?Array.from(R().subarray(Number(de)>>>0,Number(fe)>>>0)):[],activation:$e(Ie)})},847032:(u,p,y,_,$,E,M,B,q,K,se,de,fe,Ie,Dt)=>{i.kb("ConvTranspose",u,{format:q?"NHWC":"NCHW",autoPad:p,dilations:[y],group:_,kernelShape:[$],pads:[E,M],strides:[B],wIsConst:()=>!!ue()[K>>>0],outputPadding:se?Array.from(R().subarray(Number(se)>>>0,Number(de)>>>0)):[],outputShape:fe?Array.from(R().subarray(Number(fe)>>>0,Number(Ie)>>>0)):[],activation:$e(Dt)})},847465:(u,p,y,_,$,E,M,B,q,K,se,de,fe,Ie)=>{i.kb("ConvTranspose",u,{format:B?"NHWC":"NCHW",autoPad:p,dilations:Array.from(R().subarray(Number(y)>>>0,2+(Number(y)>>>0)>>>0)),group:_,kernelShape:Array.from(R().subarray(Number($)>>>0,2+(Number($)>>>0)>>>0)),pads:Array.from(R().subarray(Number(E)>>>0,4+(Number(E)>>>0)>>>0)),strides:Array.from(R().subarray(Number(M)>>>0,2+(Number(M)>>>0)>>>0)),wIsConst:()=>!!ue()[q>>>0],outputPadding:K?Array.from(R().subarray(Number(K)>>>0,Number(se)>>>0)):[],outputShape:de?Array.from(R().subarray(Number(de)>>>0,Number(fe)>>>0)):[],activation:$e(Ie)})},848126:(u,p)=>{i.kb("GlobalAveragePool",u,{format:p?"NHWC":"NCHW"})},848217:(u,p,y,_,$,E,M,B,q,K,se,de,fe,Ie)=>{i.kb("AveragePool",u,{format:Ie?"NHWC":"NCHW",auto_pad:p,ceil_mode:y,count_include_pad:_,storage_order:$,dilations:E?Array.from(R().subarray(Number(E)>>>0,Number(M)>>>0)):[],kernel_shape:B?Array.from(R().subarray(Number(B)>>>0,Number(q)>>>0)):[],pads:K?Array.from(R().subarray(Number(K)>>>0,Number(se)>>>0)):[],strides:de?Array.from(R().subarray(Number(de)>>>0,Number(fe)>>>0)):[]})},848696:(u,p)=>{i.kb("GlobalAveragePool",u,{format:p?"NHWC":"NCHW"})},848787:(u,p,y,_,$,E,M,B,q,K,se,de,fe,Ie)=>{i.kb("AveragePool",u,{format:Ie?"NHWC":"NCHW",auto_pad:p,ceil_mode:y,count_include_pad:_,storage_order:$,dilations:E?Array.from(R().subarray(Number(E)>>>0,Number(M)>>>0)):[],kernel_shape:B?Array.from(R().subarray(Number(B)>>>0,Number(q)>>>0)):[],pads:K?Array.from(R().subarray(Number(K)>>>0,Number(se)>>>0)):[],strides:de?Array.from(R().subarray(Number(de)>>>0,Number(fe)>>>0)):[]})},849266:(u,p)=>{i.kb("GlobalMaxPool",u,{format:p?"NHWC":"NCHW"})},849353:(u,p,y,_,$,E,M,B,q,K,se,de,fe,Ie)=>{i.kb("MaxPool",u,{format:Ie?"NHWC":"NCHW",auto_pad:p,ceil_mode:y,count_include_pad:_,storage_order:$,dilations:E?Array.from(R().subarray(Number(E)>>>0,Number(M)>>>0)):[],kernel_shape:B?Array.from(R().subarray(Number(B)>>>0,Number(q)>>>0)):[],pads:K?Array.from(R().subarray(Number(K)>>>0,Number(se)>>>0)):[],strides:de?Array.from(R().subarray(Number(de)>>>0,Number(fe)>>>0)):[]})},849828:(u,p)=>{i.kb("GlobalMaxPool",u,{format:p?"NHWC":"NCHW"})},849915:(u,p,y,_,$,E,M,B,q,K,se,de,fe,Ie)=>{i.kb("MaxPool",u,{format:Ie?"NHWC":"NCHW",auto_pad:p,ceil_mode:y,count_include_pad:_,storage_order:$,dilations:E?Array.from(R().subarray(Number(E)>>>0,Number(M)>>>0)):[],kernel_shape:B?Array.from(R().subarray(Number(B)>>>0,Number(q)>>>0)):[],pads:K?Array.from(R().subarray(Number(K)>>>0,Number(se)>>>0)):[],strides:de?Array.from(R().subarray(Number(de)>>>0,Number(fe)>>>0)):[]})},850390:(u,p,y,_,$)=>{i.kb("Gemm",u,{alpha:p,beta:y,transA:_,transB:$})},850494:u=>{i.kb("MatMul",u,void 0)},850548:(u,p,y,_)=>{i.kb("ArgMax",u,{keepDims:!!p,selectLastIndex:!!y,axis:_})},850656:(u,p,y,_)=>{i.kb("ArgMin",u,{keepDims:!!p,selectLastIndex:!!y,axis:_})},850764:(u,p)=>{i.kb("Softmax",u,{axis:p})},850827:(u,p)=>{i.kb("Concat",u,{axis:p})},850887:(u,p,y,_,$)=>{i.kb("Split",u,{axis:p,numOutputs:y,splitSizes:_?Array.from(R().subarray(Number(_)>>>0,Number($)>>>0)):[]})},851043:u=>{i.kb("Expand",u,void 0)},851097:(u,p)=>{i.kb("Gather",u,{axis:Number(p)})},851168:(u,p)=>{i.kb("GatherElements",u,{axis:Number(p)})},851247:(u,p)=>{i.kb("GatherND",u,{batch_dims:Number(p)})},851326:(u,p,y,_,$,E,M,B,q,K,se)=>{i.kb("Resize",u,{antialias:p,axes:y?Array.from(R().subarray(Number(y)>>>0,Number(_)>>>0)):[],coordinateTransformMode:$e($),cubicCoeffA:E,excludeOutside:M,extrapolationValue:B,keepAspectRatioPolicy:$e(q),mode:$e(K),nearestMode:$e(se)})},851688:(u,p,y,_,$,E,M)=>{i.kb("Slice",u,{starts:p?Array.from(R().subarray(Number(p)>>>0,Number(y)>>>0)):[],ends:_?Array.from(R().subarray(Number(_)>>>0,Number($)>>>0)):[],axes:E?Array.from(R().subarray(Number(E)>>>0,Number(M)>>>0)):[]})},851952:u=>{i.kb("Tile",u,void 0)},852004:(u,p,y)=>{i.kb("InstanceNormalization",u,{epsilon:p,format:y?"NHWC":"NCHW"})},852118:(u,p,y)=>{i.kb("InstanceNormalization",u,{epsilon:p,format:y?"NHWC":"NCHW"})},852232:u=>{i.kb("Range",u,void 0)},852285:(u,p)=>{i.kb("Einsum",u,{equation:$e(p)})},852366:(u,p,y,_,$)=>{i.kb("Pad",u,{mode:p,value:y,pads:_?Array.from(R().subarray(Number(_)>>>0,Number($)>>>0)):[]})},852509:(u,p,y,_,$,E)=>{i.kb("BatchNormalization",u,{epsilon:p,momentum:y,spatial:!!$,trainingMode:!!_,format:E?"NHWC":"NCHW"})},852678:(u,p,y,_,$,E)=>{i.kb("BatchNormalization",u,{epsilon:p,momentum:y,spatial:!!$,trainingMode:!!_,format:E?"NHWC":"NCHW"})},852847:(u,p,y)=>{i.kb("CumSum",u,{exclusive:Number(p),reverse:Number(y)})},852944:(u,p,y)=>{i.kb("DequantizeLinear",u,{axis:p,blockSize:y})},853034:(u,p,y,_,$)=>{i.kb("GridSample",u,{align_corners:p,mode:$e(y),padding_mode:$e(_),format:$?"NHWC":"NCHW"})},853204:(u,p,y,_,$)=>{i.kb("GridSample",u,{align_corners:p,mode:$e(y),padding_mode:$e(_),format:$?"NHWC":"NCHW"})},853374:(u,p)=>{i.kb("ScatterND",u,{reduction:$e(p)})},853459:(u,p,y,_,$,E,M,B,q)=>{i.kb("Attention",u,{numHeads:p,isUnidirectional:y,maskFilterValue:_,scale:$,doRotary:E,qkvHiddenSizes:M?Array.from(R().subarray(Number(B)>>>0,Number(B)+M>>>0)):[],pastPresentShareBuffer:!!q})},853731:u=>{i.kb("BiasAdd",u,void 0)},853786:u=>{i.kb("BiasSplitGelu",u,void 0)},853847:u=>{i.kb("FastGelu",u,void 0)},853903:(u,p,y,_,$,E,M,B,q,K,se,de,fe,Ie,Dt,ng)=>{i.kb("Conv",u,{format:de?"NHWC":"NCHW",auto_pad:p,dilations:y?Array.from(R().subarray(Number(y)>>>0,Number(_)>>>0)):[],group:$,kernel_shape:E?Array.from(R().subarray(Number(E)>>>0,Number(M)>>>0)):[],pads:B?Array.from(R().subarray(Number(B)>>>0,Number(q)>>>0)):[],strides:K?Array.from(R().subarray(Number(K)>>>0,Number(se)>>>0)):[],w_is_const:()=>!!ue()[Number(fe)>>>0],activation:$e(Ie),activation_params:Dt?Array.from(Ee().subarray(Number(Dt)>>>0,Number(ng)>>>0)):[]})},854487:u=>{i.kb("Gelu",u,void 0)},854539:(u,p,y,_,$,E,M,B,q)=>{i.kb("GroupQueryAttention",u,{numHeads:p,kvNumHeads:y,scale:_,softcap:$,doRotary:E,rotaryInterleaved:M,smoothSoftmax:B,localWindowSize:q})},854756:(u,p,y,_)=>{i.kb("LayerNormalization",u,{axis:p,epsilon:y,simplified:!!_})},854867:(u,p,y,_)=>{i.kb("LayerNormalization",u,{axis:p,epsilon:y,simplified:!!_})},854978:(u,p,y,_,$,E)=>{i.kb("MatMulNBits",u,{k:p,n:y,accuracyLevel:_,bits:$,blockSize:E})},855105:(u,p,y,_,$,E)=>{i.kb("MultiHeadAttention",u,{numHeads:p,isUnidirectional:y,maskFilterValue:_,scale:$,doRotary:E})},855264:(u,p)=>{i.kb("QuickGelu",u,{alpha:p})},855328:(u,p,y,_,$)=>{i.kb("RotaryEmbedding",u,{interleaved:!!p,numHeads:y,rotaryEmbeddingDim:_,scale:$})},855467:(u,p,y)=>{i.kb("SkipLayerNormalization",u,{epsilon:p,simplified:!!y})},855569:(u,p,y)=>{i.kb("SkipLayerNormalization",u,{epsilon:p,simplified:!!y})},855671:(u,p,y,_)=>{i.kb("GatherBlockQuantized",u,{gatherAxis:p,quantizeAxis:y,blockSize:_})},855792:u=>{i.$b(u)},855826:(u,p)=>i.bc(Number(u),Number(p),i.Gb.ec,i.Gb.errors)};function Bf(u,p,y){return ws(async()=>{await i.Yb(Number(u),Number(p),Number(y))})}function Df(){return typeof wasmOffsetConverter<"u"}class li{name="ExitStatus";constructor(p){this.message=`Program terminated with exit(${p})`,this.status=p}}var Ua=u=>{u.terminate(),u.onmessage=()=>{}},di=[],Wa=u=>{lt.length==0&&(ja(),Ga(lt[0]));var p=lt.pop();if(!p)return 6;jt.push(p),bt[u.Bb]=p,p.Bb=u.Bb;var y={Cb:"run",hc:u.fc,Ib:u.Ib,Bb:u.Bb};return p.postMessage(y,u.Nb),0},ut=0,ye=(u,p,...y)=>{for(var _=2*y.length,$=Ei(),E=ki(8*_),M=E>>>3,B=0;B<y.length;B++){var q=y[B];typeof q=="bigint"?(U[M+2*B]=1n,U[M+2*B+1]=q):(U[M+2*B]=0n,Ne()[M+2*B+1>>>0]=q)}return u=Ws(u,0,_,E,p),zr($),u};function ci(u){if(o)return ye(0,1,u);if(C=u,!(0<ut)){for(var p of jt)Ua(p);for(p of lt)Ua(p);lt=[],jt=[],bt={},oe=!0}m(0,new li(u))}function qa(u){if(o)return ye(1,0,u);pi(u)}var pi=u=>{if(C=u,o)throw qa(u),"unwind";ci(u)},lt=[],jt=[],Ha=[],bt={},Fa=u=>{var p=u.Bb;delete bt[p],lt.push(u),jt.splice(jt.indexOf(u),1),u.Bb=0,qs(p)};function Va(){Ha.forEach(u=>u())}var Ga=u=>new Promise(p=>{u.onmessage=$=>{var E=($=$.data).Cb;if($.Hb&&$.Hb!=Cr()){var M=bt[$.Hb];M?M.postMessage($,$.Nb):S(`Internal error! Worker sent a message "${E}" to target pthread ${$.Hb}, but that thread no longer exists!`)}else E==="checkMailbox"?xr():E==="spawnThread"?Wa($):E==="cleanupThread"?Fa(bt[$.ic]):E==="loaded"?(u.loaded=!0,p(u)):E==="alert"?alert(`Thread ${$.jc}: ${$.text}`):$.target==="setimmediate"?u.postMessage($):E==="callHandler"?i[$.Rb](...$.args):E&&S(`worker sent an unknown command ${E}`)},u.onerror=$=>{throw S(`worker sent an error! ${$.filename}:${$.lineno}: ${$.message}`),$};var y,_=[];for(y of[])i.propertyIsEnumerable(y)&&_.push(y);u.postMessage({Cb:"load",Sb:_,lc:T,mc:I})});function ja(){var u=new Worker((()=>{let p=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new p("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});lt.push(u)}var Lf=u=>{ze();var p=ie()[u+52>>>2>>>0];u=ie()[u+56>>>2>>>0],Vs(p,p-u),zr(p)},Uf=(u,p)=>{ut=0,u=Gs(u,p),0<ut?C=u:Ii(u)};class Wf{constructor(p){this.Jb=p-24}}function qf(u,p,y){var _=new Wf(u>>>=0);throw p>>>=0,y>>>=0,ie()[_.Jb+16>>>2>>>0]=0,ie()[_.Jb+4>>>2>>>0]=p,ie()[_.Jb+8>>>2>>>0]=y,u}function Ka(u,p,y,_){return o?ye(2,1,u,p,y,_):Xa(u,p,y,_)}function Xa(u,p,y,_){if(u>>>=0,y>>>=0,_>>>=0,l===void 0)return 6;var $=[];return o&&$.length===0?Ka(u,p>>>=0,y,_):(u={fc:y,Bb:u,Ib:_,Nb:$},o?(u.Cb="spawnThread",postMessage(u,$),0):Wa(u))}var Ya=typeof TextDecoder<"u"?new TextDecoder:void 0,Za=(u,p=0,y=NaN)=>{var _=(p>>>=0)+y;for(y=p;u[y]&&!(y>=_);)++y;if(16<y-p&&u.buffer&&Ya)return Ya.decode(u.buffer instanceof ArrayBuffer?u.subarray(p,y):u.slice(p,y));for(_="";p<y;){var $=u[p++];if(128&$){var E=63&u[p++];if((224&$)==192)_+=String.fromCharCode((31&$)<<6|E);else{var M=63&u[p++];65536>($=(240&$)==224?(15&$)<<12|E<<6|M:(7&$)<<18|E<<12|M<<6|63&u[p++])?_+=String.fromCharCode($):($-=65536,_+=String.fromCharCode(55296|$>>10,56320|1023&$))}}else _+=String.fromCharCode($)}return _},$e=(u,p)=>(u>>>=0)?Za(P(),u,p):"";function Qa(u,p,y){return o?ye(3,1,u,p,y):0}function Ja(u,p){if(o)return ye(4,1,u,p)}var es=u=>{for(var p=0,y=0;y<u.length;++y){var _=u.charCodeAt(y);127>=_?p++:2047>=_?p+=2:55296<=_&&57343>=_?(p+=4,++y):p+=3}return p},Nt=(u,p,y)=>{var _=P();if(p>>>=0,0<y){var $=p;y=p+y-1;for(var E=0;E<u.length;++E){var M=u.charCodeAt(E);if(55296<=M&&57343>=M&&(M=65536+((1023&M)<<10)|1023&u.charCodeAt(++E)),127>=M){if(p>=y)break;_[p++>>>0]=M}else{if(2047>=M){if(p+1>=y)break;_[p++>>>0]=192|M>>6}else{if(65535>=M){if(p+2>=y)break;_[p++>>>0]=224|M>>12}else{if(p+3>=y)break;_[p++>>>0]=240|M>>18,_[p++>>>0]=128|M>>12&63}_[p++>>>0]=128|M>>6&63}_[p++>>>0]=128|63&M}}_[p>>>0]=0,u=p-$}else u=0;return u};function ts(u,p){if(o)return ye(5,1,u,p)}function rs(u,p,y){if(o)return ye(6,1,u,p,y)}function is(u,p,y){return o?ye(7,1,u,p,y):0}function ns(u,p){if(o)return ye(8,1,u,p)}function as(u,p,y){if(o)return ye(9,1,u,p,y)}function ss(u,p,y,_){if(o)return ye(10,1,u,p,y,_)}function os(u,p,y,_){if(o)return ye(11,1,u,p,y,_)}function us(u,p,y,_){if(o)return ye(12,1,u,p,y,_)}function ls(u){if(o)return ye(13,1,u)}function ds(u,p){if(o)return ye(14,1,u,p)}function cs(u,p,y){if(o)return ye(15,1,u,p,y)}var ps,dt,Hf=()=>ot(""),Ze=u=>{for(var p="";P()[u>>>0];)p+=ps[P()[u++>>>0]];return p},hi={},fi={},Ff={};function rt(u,p,y={}){return(function(_,$,E={}){var M=$.name;if(!_)throw new dt(`type "${M}" must have a positive integer typeid pointer`);if(fi.hasOwnProperty(_)){if(E.Tb)return;throw new dt(`Cannot register type '${M}' twice`)}fi[_]=$,delete Ff[_],hi.hasOwnProperty(_)&&($=hi[_],delete hi[_],$.forEach(B=>B()))})(u,p,y)}var hs=(u,p,y)=>{switch(p){case 1:return y?_=>ue()[_>>>0]:_=>P()[_>>>0];case 2:return y?_=>W()[_>>>1>>>0]:_=>te()[_>>>1>>>0];case 4:return y?_=>R()[_>>>2>>>0]:_=>ie()[_>>>2>>>0];case 8:return y?_=>U[_>>>3]:_=>re[_>>>3];default:throw new TypeError(`invalid integer width (${p}): ${u}`)}};function Vf(u,p,y){y>>>=0,rt(u>>>=0,{name:p=Ze(p>>>0),fromWireType:_=>_,toWireType:function(_,$){if(typeof $!="bigint"&&typeof $!="number")throw $=$===null?"null":(_=typeof $)=="object"||_==="array"||_==="function"?$.toString():""+$,new TypeError(`Cannot convert "${$}" to ${this.name}`);return typeof $=="number"&&($=BigInt($)),$},Db:ct,readValueFromPointer:hs(p,y,p.indexOf("u")==-1),Eb:null})}var ct=8;function Gf(u,p,y,_){rt(u>>>=0,{name:p=Ze(p>>>0),fromWireType:function($){return!!$},toWireType:function($,E){return E?y:_},Db:ct,readValueFromPointer:function($){return this.fromWireType(P()[$>>>0])},Eb:null})}var mi=[],it=[];function gi(u){9<(u>>>=0)&&--it[u+1]==0&&(it[u]=void 0,mi.push(u))}var Ce=u=>{if(!u)throw new dt("Cannot use deleted val. handle = "+u);return it[u]},Be=u=>{switch(u){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let p=mi.pop()||it.length;return it[p]=u,it[p+1]=1,p}};function yi(u){return this.fromWireType(ie()[u>>>2>>>0])}var jf={name:"emscripten::val",fromWireType:u=>{var p=Ce(u);return gi(u),p},toWireType:(u,p)=>Be(p),Db:ct,readValueFromPointer:yi,Eb:null};function Kf(u){return rt(u>>>0,jf)}var Xf=(u,p)=>{switch(p){case 4:return function(y){return this.fromWireType(Ee()[y>>>2>>>0])};case 8:return function(y){return this.fromWireType(Ne()[y>>>3>>>0])};default:throw new TypeError(`invalid float width (${p}): ${u}`)}};function Yf(u,p,y){y>>>=0,rt(u>>>=0,{name:p=Ze(p>>>0),fromWireType:_=>_,toWireType:(_,$)=>$,Db:ct,readValueFromPointer:Xf(p,y),Eb:null})}function Zf(u,p,y,_,$){if(u>>>=0,y>>>=0,p=Ze(p>>>0),$===-1&&($=4294967295),$=B=>B,_===0){var E=32-8*y;$=B=>B<<E>>>E}var M=p.includes("unsigned")?function(B,q){return q>>>0}:function(B,q){return q};rt(u,{name:p,fromWireType:$,toWireType:M,Db:ct,readValueFromPointer:hs(p,y,_!==0),Eb:null})}function Qf(u,p,y){function _(E){var M=ie()[E>>>2>>>0];return E=ie()[E+4>>>2>>>0],new $(ue().buffer,E,M)}var $=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][p];rt(u>>>=0,{name:y=Ze(y>>>0),fromWireType:_,Db:ct,readValueFromPointer:_},{Tb:!0})}function Jf(u,p){rt(u>>>=0,{name:p=Ze(p>>>0),fromWireType:function(y){for(var _,$=ie()[y>>>2>>>0],E=y+4,M=E,B=0;B<=$;++B){var q=E+B;B!=$&&P()[q>>>0]!=0||(M=$e(M,q-M),_===void 0?_=M:(_+="\0",_+=M),M=q+1)}return Je(y),_},toWireType:function(y,_){_ instanceof ArrayBuffer&&(_=new Uint8Array(_));var $=typeof _=="string";if(!($||_ instanceof Uint8Array||_ instanceof Uint8ClampedArray||_ instanceof Int8Array))throw new dt("Cannot pass non-string to std::string");var E=$?es(_):_.length,M=Or(4+E+1),B=M+4;if(ie()[M>>>2>>>0]=E,$)Nt(_,B,E+1);else if($)for($=0;$<E;++$){var q=_.charCodeAt($);if(255<q)throw Je(M),new dt("String has UTF-16 code units that do not fit in 8 bits");P()[B+$>>>0]=q}else for($=0;$<E;++$)P()[B+$>>>0]=_[$];return y!==null&&y.push(Je,M),M},Db:ct,readValueFromPointer:yi,Eb(y){Je(y)}})}var fs=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,em=(u,p)=>{for(var y=u>>1,_=y+p/2;!(y>=_)&&te()[y>>>0];)++y;if(32<(y<<=1)-u&&fs)return fs.decode(P().slice(u,y));for(y="",_=0;!(_>=p/2);++_){var $=W()[u+2*_>>>1>>>0];if($==0)break;y+=String.fromCharCode($)}return y},tm=(u,p,y)=>{if(y??=2147483647,2>y)return 0;var _=p;y=(y-=2)<2*u.length?y/2:u.length;for(var $=0;$<y;++$){var E=u.charCodeAt($);W()[p>>>1>>>0]=E,p+=2}return W()[p>>>1>>>0]=0,p-_},rm=u=>2*u.length,im=(u,p)=>{for(var y=0,_="";!(y>=p/4);){var $=R()[u+4*y>>>2>>>0];if($==0)break;++y,65536<=$?($-=65536,_+=String.fromCharCode(55296|$>>10,56320|1023&$)):_+=String.fromCharCode($)}return _},nm=(u,p,y)=>{if(p>>>=0,y??=2147483647,4>y)return 0;var _=p;y=_+y-4;for(var $=0;$<u.length;++$){var E=u.charCodeAt($);if(55296<=E&&57343>=E&&(E=65536+((1023&E)<<10)|1023&u.charCodeAt(++$)),R()[p>>>2>>>0]=E,(p+=4)+4>y)break}return R()[p>>>2>>>0]=0,p-_},am=u=>{for(var p=0,y=0;y<u.length;++y){var _=u.charCodeAt(y);55296<=_&&57343>=_&&++y,p+=4}return p};function sm(u,p,y){if(u>>>=0,p>>>=0,y=Ze(y>>>=0),p===2)var _=em,$=tm,E=rm,M=B=>te()[B>>>1>>>0];else p===4&&(_=im,$=nm,E=am,M=B=>ie()[B>>>2>>>0]);rt(u,{name:y,fromWireType:B=>{for(var q,K=ie()[B>>>2>>>0],se=B+4,de=0;de<=K;++de){var fe=B+4+de*p;de!=K&&M(fe)!=0||(se=_(se,fe-se),q===void 0?q=se:(q+="\0",q+=se),se=fe+p)}return Je(B),q},toWireType:(B,q)=>{if(typeof q!="string")throw new dt(`Cannot pass non-string to C++ string type ${y}`);var K=E(q),se=Or(4+K+p);return ie()[se>>>2>>>0]=K/p,$(q,se+4,K+p),B!==null&&B.push(Je,se),se},Db:ct,readValueFromPointer:yi,Eb(B){Je(B)}})}function om(u,p){rt(u>>>=0,{Ub:!0,name:p=Ze(p>>>0),Db:0,fromWireType:()=>{},toWireType:()=>{}})}function um(u){Ti(u>>>0,!s,1,!a,131072,!1),Va()}var bi=u=>{if(!oe)try{if(u(),!(0<ut))try{o?Ii(C):pi(C)}catch(p){p instanceof li||p=="unwind"||m(0,p)}}catch(p){p instanceof li||p=="unwind"||m(0,p)}};function wi(u){u>>>=0,typeof Atomics.kc=="function"&&(Atomics.kc(R(),u>>>2,u).value.then(xr),u+=128,Atomics.store(R(),u>>>2,1))}var xr=()=>{var u=Cr();u&&(wi(u),bi(Fs))};function lm(u,p){(u>>>=0)==p>>>0?setTimeout(xr):o?postMessage({Hb:u,Cb:"checkMailbox"}):(u=bt[u])&&u.postMessage({Cb:"checkMailbox"})}var _i=[];function dm(u,p,y,_,$){for(p>>>=0,_/=2,_i.length=_,y=$>>>0>>>3,$=0;$<_;$++)_i[$]=U[y+2*$]?U[y+2*$+1]:Ne()[y+2*$+1>>>0];return(p?ui[p]:ig[u])(..._i)}var cm=()=>{ut=0};function pm(u){u>>>=0,o?postMessage({Cb:"cleanupThread",ic:u}):Fa(bt[u])}function hm(u){}var $r=(u,p)=>{var y=fi[u];if(y===void 0)throw u=Ds(u),y=Ze(u),Je(u),new dt(`${p} has unknown type ${y}`);return y},ms=(u,p,y)=>{var _=[];return u=u.toWireType(_,y),_.length&&(ie()[p>>>2>>>0]=Be(_)),u};function fm(u,p,y){return p>>>=0,y>>>=0,u=Ce(u>>>0),p=$r(p,"emval::as"),ms(p,y,u)}function mm(u,p){return p>>>=0,u=Ce(u>>>0),(p=$r(p,"emval::as")).toWireType(null,u)}var vr=u=>{try{u()}catch(p){ot(p)}},pt=0,Qe=null,gs=0,Sr=[],ys={},bs={},gm=0,xi=null,ym=[];function ws(u){return(function(p){if(!oe){if(pt===0){var y=!1,_=!1;p(($=0)=>{if(!oe&&(gs=$,y=!0,_)){pt=2,vr(()=>Xs(Qe)),typeof MainLoop<"u"&&MainLoop.Qb&&MainLoop.resume(),$=!1;try{var E=(function(){var q=R()[Qe+8>>>2>>>0];return q=Q[bs[q]],--ut,q()})()}catch(q){E=q,$=!0}var M=!1;if(!Qe){var B=xi;B&&(xi=null,($?B.reject:B.resolve)(E),M=!0)}if($&&!M)throw E}}),_=!0,y||(pt=1,Qe=(function(){var $=Or(65548),E=$+12;ie()[$>>>2>>>0]=E,ie()[$+4>>>2>>>0]=E+65536,E=Sr[0];var M=ys[E];return M===void 0&&(M=gm++,ys[E]=M,bs[M]=E),E=M,R()[$+8>>>2>>>0]=E,$})(),typeof MainLoop<"u"&&MainLoop.Qb&&MainLoop.pause(),vr(()=>js(Qe)))}else pt===2?(pt=0,vr(Ys),Je(Qe),Qe=null,ym.forEach(bi)):ot(`invalid state: ${pt}`);return gs}})(p=>{u().then(p)})}function bm(u){return u>>>=0,ws(async()=>{var p=await Ce(u);return Be(p)})}var Tr=[];function wm(u,p,y,_){return y>>>=0,_>>>=0,(u=Tr[u>>>0])(null,p=Ce(p>>>0),y,_)}var _m={},Ir=u=>{var p=_m[u];return p===void 0?Ze(u):p};function xm(u,p,y,_,$){return y>>>=0,_>>>=0,$>>>=0,(u=Tr[u>>>0])(p=Ce(p>>>0),p[y=Ir(y)],_,$)}function $m(u,p){return p>>>=0,(u=Ce(u>>>0))==Ce(p)}var _s=()=>typeof globalThis=="object"?globalThis:Function("return this")();function vm(u){return(u>>>=0)==0?Be(_s()):(u=Ir(u),Be(_s()[u]))}var Sm=u=>{var p=Tr.length;return Tr.push(u),p},Tm=(u,p)=>{for(var y=Array(u),_=0;_<u;++_)y[_]=$r(ie()[p+4*_>>>2>>>0],"parameter "+_);return y},xs=(u,p)=>Object.defineProperty(p,"name",{value:u});function Im(u,p,y){var _=(p=Tm(u,p>>>0)).shift();u--;var $=`return function (obj, func, destructorsRef, args) {
`,E=0,M=[];y===0&&M.push("obj");for(var B=["retType"],q=[_],K=0;K<u;++K)M.push("arg"+K),B.push("argType"+K),q.push(p[K]),$+=`  var arg${K} = argType${K}.readValueFromPointer(args${E?"+"+E:""});
`,E+=p[K].Db;return $+=`  var rv = ${y===1?"new func":"func.call"}(${M.join(", ")});
`,_.Ub||(B.push("emval_returnValue"),q.push(ms),$+=`  return emval_returnValue(retType, destructorsRef, rv);
`),B.push($+`};
`),u=(function(se){var de=Function;if(!(de instanceof Function))throw new TypeError(`new_ called with constructor type ${typeof de} which is not a function`);var fe=xs(de.name||"unknownFunctionName",function(){});return fe.prototype=de.prototype,fe=new fe,(se=de.apply(fe,se))instanceof Object?se:fe})(B)(...q),y=`methodCaller<(${p.map(se=>se.name).join(", ")}) => ${_.name}>`,Sm(xs(y,u))}function km(u){return u=Ir(u>>>0),Be(i[u])}function Em(u,p){return p>>>=0,u=Ce(u>>>0),p=Ce(p),Be(u[p])}function Cm(u){9<(u>>>=0)&&(it[u+1]+=1)}function Om(){return Be([])}function zm(u){u=Ce(u>>>0);for(var p=Array(u.length),y=0;y<u.length;y++)p[y]=u[y];return Be(p)}function Rm(u){return Be(Ir(u>>>0))}function Mm(){return Be({})}function Am(u){for(var p=Ce(u>>>=0);p.length;){var y=p.pop();p.pop()(y)}gi(u)}function Pm(u,p,y){p>>>=0,y>>>=0,u=Ce(u>>>0),p=Ce(p),y=Ce(y),u[p]=y}function Nm(u,p){return p>>>=0,u=(u=$r(u>>>0,"_emval_take_value")).readValueFromPointer(p),Be(u)}function Bm(u,p){u=-9007199254740992>u||9007199254740992<u?NaN:Number(u),p>>>=0,u=new Date(1e3*u),R()[p>>>2>>>0]=u.getUTCSeconds(),R()[p+4>>>2>>>0]=u.getUTCMinutes(),R()[p+8>>>2>>>0]=u.getUTCHours(),R()[p+12>>>2>>>0]=u.getUTCDate(),R()[p+16>>>2>>>0]=u.getUTCMonth(),R()[p+20>>>2>>>0]=u.getUTCFullYear()-1900,R()[p+24>>>2>>>0]=u.getUTCDay(),u=(u.getTime()-Date.UTC(u.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,R()[p+28>>>2>>>0]=u}var $s=u=>u%4==0&&(u%100!=0||u%400==0),vs=[0,31,60,91,121,152,182,213,244,274,305,335],Ss=[0,31,59,90,120,151,181,212,243,273,304,334];function Dm(u,p){u=-9007199254740992>u||9007199254740992<u?NaN:Number(u),p>>>=0,u=new Date(1e3*u),R()[p>>>2>>>0]=u.getSeconds(),R()[p+4>>>2>>>0]=u.getMinutes(),R()[p+8>>>2>>>0]=u.getHours(),R()[p+12>>>2>>>0]=u.getDate(),R()[p+16>>>2>>>0]=u.getMonth(),R()[p+20>>>2>>>0]=u.getFullYear()-1900,R()[p+24>>>2>>>0]=u.getDay();var y=($s(u.getFullYear())?vs:Ss)[u.getMonth()]+u.getDate()-1|0;R()[p+28>>>2>>>0]=y,R()[p+36>>>2>>>0]=-60*u.getTimezoneOffset(),y=new Date(u.getFullYear(),6,1).getTimezoneOffset();var _=new Date(u.getFullYear(),0,1).getTimezoneOffset();u=0|(y!=_&&u.getTimezoneOffset()==Math.min(_,y)),R()[p+32>>>2>>>0]=u}function Lm(u){u>>>=0;var p=new Date(R()[u+20>>>2>>>0]+1900,R()[u+16>>>2>>>0],R()[u+12>>>2>>>0],R()[u+8>>>2>>>0],R()[u+4>>>2>>>0],R()[u>>>2>>>0],0),y=R()[u+32>>>2>>>0],_=p.getTimezoneOffset(),$=new Date(p.getFullYear(),6,1).getTimezoneOffset(),E=new Date(p.getFullYear(),0,1).getTimezoneOffset(),M=Math.min(E,$);return 0>y?R()[u+32>>>2>>>0]=+($!=E&&M==_):0<y!=(M==_)&&($=Math.max(E,$),p.setTime(p.getTime()+6e4*((0<y?M:$)-_))),R()[u+24>>>2>>>0]=p.getDay(),y=($s(p.getFullYear())?vs:Ss)[p.getMonth()]+p.getDate()-1|0,R()[u+28>>>2>>>0]=y,R()[u>>>2>>>0]=p.getSeconds(),R()[u+4>>>2>>>0]=p.getMinutes(),R()[u+8>>>2>>>0]=p.getHours(),R()[u+12>>>2>>>0]=p.getDate(),R()[u+16>>>2>>>0]=p.getMonth(),R()[u+20>>>2>>>0]=p.getYear(),u=p.getTime(),BigInt(isNaN(u)?-1:u/1e3)}function Ts(u,p,y,_,$,E,M){return o?ye(16,1,u,p,y,_,$,E,M):-52}function Is(u,p,y,_,$,E){if(o)return ye(17,1,u,p,y,_,$,E)}var Kt={},Um=()=>performance.timeOrigin+performance.now();function ks(u,p){if(o)return ye(18,1,u,p);if(Kt[u]&&(clearTimeout(Kt[u].id),delete Kt[u]),!p)return 0;var y=setTimeout(()=>{delete Kt[u],bi(()=>Hs(u,performance.timeOrigin+performance.now()))},p);return Kt[u]={id:y,rc:p},0}function Wm(u,p,y,_){u>>>=0,p>>>=0,y>>>=0,_>>>=0;var $=new Date().getFullYear(),E=new Date($,0,1).getTimezoneOffset();$=new Date($,6,1).getTimezoneOffset();var M=Math.max(E,$);ie()[u>>>2>>>0]=60*M,R()[p>>>2>>>0]=+(E!=$),u=(p=B=>{var q=Math.abs(B);return`UTC${0<=B?"-":"+"}${String(Math.floor(q/60)).padStart(2,"0")}${String(q%60).padStart(2,"0")}`})(E),p=p($),$<E?(Nt(u,y,17),Nt(p,_,17)):(Nt(u,_,17),Nt(p,y,17))}var qm=()=>Date.now(),Hm=1;function Fm(u,p,y){if(!(0<=u&&3>=u))return 28;if(u===0)u=Date.now();else{if(!Hm)return 52;u=performance.timeOrigin+performance.now()}return U[y>>>0>>>3]=BigInt(Math.round(1e6*u)),0}var $i=[],Es=(u,p)=>{$i.length=0;for(var y;y=P()[u++>>>0];){var _=y!=105;p+=(_&=y!=112)&&p%8?4:0,$i.push(y==112?ie()[p>>>2>>>0]:y==106?U[p>>>3]:y==105?R()[p>>>2>>>0]:Ne()[p>>>3>>>0]),p+=_?8:4}return $i};function Vm(u,p,y){return u>>>=0,p=Es(p>>>0,y>>>0),ui[u](...p)}function Gm(u,p,y){return u>>>=0,p=Es(p>>>0,y>>>0),ui[u](...p)}var jm=()=>{};function Km(u,p){return S($e(u>>>0,p>>>0))}var Xm=()=>{throw ut+=1,"unwind"};function Ym(){return 4294901760}var Zm=()=>navigator.hardwareConcurrency;function Qm(){return ot("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}function Jm(u){u>>>=0;var p=P().length;if(u<=p||4294901760<u)return!1;for(var y=1;4>=y;y*=2){var _=p*(1+.2/y);_=Math.min(_,u+100663296);e:{_=(Math.min(4294901760,65536*Math.ceil(Math.max(u,_)/65536))-T.buffer.byteLength+65535)/65536|0;try{T.grow(_),ze();var $=1;break e}catch{}$=void 0}if($)return!0}return!1}var kr=()=>(ot("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),Bt={},Cs=u=>{u.forEach(p=>{var y=kr();y&&(Bt[y]=p)})};function eg(){var u=Error().stack.toString().split(`
`);return u[0]=="Error"&&u.shift(),Cs(u),Bt.Mb=kr(),Bt.dc=u,Bt.Mb}function tg(u,p,y){if(u>>>=0,p>>>=0,Bt.Mb==u)var _=Bt.dc;else(_=Error().stack.toString().split(`
`))[0]=="Error"&&_.shift(),Cs(_);for(var $=3;_[$]&&kr()!=u;)++$;for(u=0;u<y&&_[u+$];++u)R()[p+4*u>>>2>>>0]=kr();return u}var vi,Si={},Os=()=>{if(!vi){var u,p={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:"./this.program"};for(u in Si)Si[u]===void 0?delete p[u]:p[u]=Si[u];var y=[];for(u in p)y.push(`${u}=${p[u]}`);vi=y}return vi};function zs(u,p){if(o)return ye(19,1,u,p);u>>>=0,p>>>=0;var y=0;return Os().forEach((_,$)=>{var E=p+y;for($=ie()[u+4*$>>>2>>>0]=E,E=0;E<_.length;++E)ue()[$++>>>0]=_.charCodeAt(E);ue()[$>>>0]=0,y+=_.length+1}),0}function Rs(u,p){if(o)return ye(20,1,u,p);u>>>=0,p>>>=0;var y=Os();ie()[u>>>2>>>0]=y.length;var _=0;return y.forEach($=>_+=$.length+1),ie()[p>>>2>>>0]=_,0}function Ms(u){return o?ye(21,1,u):52}function As(u,p,y,_){return o?ye(22,1,u,p,y,_):52}function Ps(u,p,y,_){return o?ye(23,1,u,p,y,_):70}var rg=[null,[],[]];function Ns(u,p,y,_){if(o)return ye(24,1,u,p,y,_);p>>>=0,y>>>=0,_>>>=0;for(var $=0,E=0;E<y;E++){var M=ie()[p>>>2>>>0],B=ie()[p+4>>>2>>>0];p+=8;for(var q=0;q<B;q++){var K=P()[M+q>>>0],se=rg[u];K===0||K===10?((u===1?b:S)(Za(se)),se.length=0):se.push(K)}$+=B}return ie()[_>>>2>>>0]=$,0}o||(function(){for(var u=i.numThreads-1;u--;)ja();di.unshift(()=>{Vt++,(function(p){o?p():Promise.all(lt.map(Ga)).then(p)})(()=>Da())})})();for(var Bs=Array(256),Er=0;256>Er;++Er)Bs[Er]=String.fromCharCode(Er);ps=Bs,dt=i.BindingError=class extends Error{constructor(u){super(u),this.name="BindingError"}},i.InternalError=class extends Error{constructor(u){super(u),this.name="InternalError"}},it.push(0,1,void 0,1,null,1,!0,1,!1,1),i.count_emval_handles=()=>it.length/2-5-mi.length;var Q,ig=[ci,qa,Ka,Qa,Ja,ts,rs,is,ns,as,ss,os,us,ls,ds,cs,Ts,Is,ks,zs,Rs,Ms,As,Ps,Ns];(async function(){function u(_,$){return Q=_.exports,Q=(function(){var E=Q,M={};for(let[B,q]of Object.entries(E))M[B]=typeof q=="function"?(...K)=>{Sr.push(B);try{return q(...K)}finally{oe||(Sr.pop(),Qe&&pt===1&&Sr.length===0&&(pt=0,ut+=1,vr(Ks),typeof Fibers<"u"&&Fibers.sc()))}}:q;return M})(),Q=(function(){var E=Q,M=q=>K=>q(K)>>>0,B=q=>()=>q()>>>0;return(E=Object.assign({},E)).Ea=M(E.Ea),E.gb=B(E.gb),E.ib=M(E.ib),E.ub=M(E.ub),E.vb=B(E.vb),E.__cxa_get_exception_ptr=M(E.__cxa_get_exception_ptr),E})(),Ha.push(Q.jb),I=$,Da(),Q}Vt++;var p=La();if(i.instantiateWasm)return new Promise(_=>{i.instantiateWasm(p,($,E)=>{u($,E),_($.exports)})});if(o)return new Promise(_=>{be=$=>{var E=new WebAssembly.Instance($,La());_(u(E,$))}});oi??=i.locateFile?i.locateFile?i.locateFile("ort-wasm-simd-threaded.jsep.wasm",w):w+"ort-wasm-simd-threaded.jsep.wasm":new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href;try{var y=await(async function(_){var $=oi;if(!H&&typeof WebAssembly.instantiateStreaming=="function"&&!j($))try{var E=fetch($,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(E,_)}catch(M){S(`wasm streaming compile failed: ${M}`),S("falling back to ArrayBuffer instantiation")}return(async function(M,B){try{var q=await(async function(K){if(!H)try{var se=await h(K);return new Uint8Array(se)}catch{}if(K==oi&&H)K=new Uint8Array(H);else{if(!f)throw"both async and sync fetching of the wasm failed";K=f(K)}return K})(M);return await WebAssembly.instantiate(q,B)}catch(K){S(`failed to asynchronously prepare wasm: ${K}`),ot(K)}})($,_)})(p);return u(y.instance,y.module)}catch(_){return r(_),Promise.reject(_)}})();var Ds=u=>(Ds=Q.Ea)(u),Ls=()=>(Ls=Q.Fa)();i._OrtInit=(u,p)=>(i._OrtInit=Q.Ga)(u,p),i._OrtGetLastError=(u,p)=>(i._OrtGetLastError=Q.Ha)(u,p),i._OrtCreateSessionOptions=(u,p,y,_,$,E,M,B,q,K)=>(i._OrtCreateSessionOptions=Q.Ia)(u,p,y,_,$,E,M,B,q,K),i._OrtAppendExecutionProvider=(u,p,y,_,$)=>(i._OrtAppendExecutionProvider=Q.Ja)(u,p,y,_,$),i._OrtAddFreeDimensionOverride=(u,p,y)=>(i._OrtAddFreeDimensionOverride=Q.Ka)(u,p,y),i._OrtAddSessionConfigEntry=(u,p,y)=>(i._OrtAddSessionConfigEntry=Q.La)(u,p,y),i._OrtReleaseSessionOptions=u=>(i._OrtReleaseSessionOptions=Q.Ma)(u),i._OrtCreateSession=(u,p,y)=>(i._OrtCreateSession=Q.Na)(u,p,y),i._OrtReleaseSession=u=>(i._OrtReleaseSession=Q.Oa)(u),i._OrtGetInputOutputCount=(u,p,y)=>(i._OrtGetInputOutputCount=Q.Pa)(u,p,y),i._OrtGetInputOutputMetadata=(u,p,y,_)=>(i._OrtGetInputOutputMetadata=Q.Qa)(u,p,y,_),i._OrtFree=u=>(i._OrtFree=Q.Ra)(u),i._OrtCreateTensor=(u,p,y,_,$,E)=>(i._OrtCreateTensor=Q.Sa)(u,p,y,_,$,E),i._OrtGetTensorData=(u,p,y,_,$)=>(i._OrtGetTensorData=Q.Ta)(u,p,y,_,$),i._OrtReleaseTensor=u=>(i._OrtReleaseTensor=Q.Ua)(u),i._OrtCreateRunOptions=(u,p,y,_)=>(i._OrtCreateRunOptions=Q.Va)(u,p,y,_),i._OrtAddRunConfigEntry=(u,p,y)=>(i._OrtAddRunConfigEntry=Q.Wa)(u,p,y),i._OrtReleaseRunOptions=u=>(i._OrtReleaseRunOptions=Q.Xa)(u),i._OrtCreateBinding=u=>(i._OrtCreateBinding=Q.Ya)(u),i._OrtBindInput=(u,p,y)=>(i._OrtBindInput=Q.Za)(u,p,y),i._OrtBindOutput=(u,p,y,_)=>(i._OrtBindOutput=Q._a)(u,p,y,_),i._OrtClearBoundOutputs=u=>(i._OrtClearBoundOutputs=Q.$a)(u),i._OrtReleaseBinding=u=>(i._OrtReleaseBinding=Q.ab)(u),i._OrtRunWithBinding=(u,p,y,_,$)=>(i._OrtRunWithBinding=Q.bb)(u,p,y,_,$),i._OrtRun=(u,p,y,_,$,E,M,B)=>(i._OrtRun=Q.cb)(u,p,y,_,$,E,M,B),i._OrtEndProfiling=u=>(i._OrtEndProfiling=Q.db)(u),i._JsepOutput=(u,p,y)=>(i._JsepOutput=Q.eb)(u,p,y),i._JsepGetNodeName=u=>(i._JsepGetNodeName=Q.fb)(u);var Cr=()=>(Cr=Q.gb)(),Je=i._free=u=>(Je=i._free=Q.hb)(u),Or=i._malloc=u=>(Or=i._malloc=Q.ib)(u),Ti=(u,p,y,_,$,E)=>(Ti=Q.lb)(u,p,y,_,$,E),Us=()=>(Us=Q.mb)(),Ws=(u,p,y,_,$)=>(Ws=Q.nb)(u,p,y,_,$),qs=u=>(qs=Q.ob)(u),Ii=u=>(Ii=Q.pb)(u),Hs=(u,p)=>(Hs=Q.qb)(u,p),Fs=()=>(Fs=Q.rb)(),Vs=(u,p)=>(Vs=Q.sb)(u,p),zr=u=>(zr=Q.tb)(u),ki=u=>(ki=Q.ub)(u),Ei=()=>(Ei=Q.vb)(),Gs=i.dynCall_ii=(u,p)=>(Gs=i.dynCall_ii=Q.wb)(u,p),js=u=>(js=Q.xb)(u),Ks=()=>(Ks=Q.yb)(),Xs=u=>(Xs=Q.zb)(u),Ys=()=>(Ys=Q.Ab)();return i.stackSave=()=>Ei(),i.stackRestore=u=>zr(u),i.stackAlloc=u=>ki(u),i.setValue=function(u,p,y="i8"){switch(y.endsWith("*")&&(y="*"),y){case"i1":case"i8":ue()[u>>>0]=p;break;case"i16":W()[u>>>1>>>0]=p;break;case"i32":R()[u>>>2>>>0]=p;break;case"i64":U[u>>>3]=BigInt(p);break;case"float":Ee()[u>>>2>>>0]=p;break;case"double":Ne()[u>>>3>>>0]=p;break;case"*":ie()[u>>>2>>>0]=p;break;default:ot(`invalid type for setValue: ${y}`)}},i.getValue=function(u,p="i8"){switch(p.endsWith("*")&&(p="*"),p){case"i1":case"i8":return ue()[u>>>0];case"i16":return W()[u>>>1>>>0];case"i32":return R()[u>>>2>>>0];case"i64":return U[u>>>3];case"float":return Ee()[u>>>2>>>0];case"double":return Ne()[u>>>3>>>0];case"*":return ie()[u>>>2>>>0];default:ot(`invalid type for getValue: ${p}`)}},i.UTF8ToString=$e,i.stringToUTF8=Nt,i.lengthBytesUTF8=es,(function u(){if(0<Vt)Gt=u;else if(o)t(i),_r();else{for(;0<di.length;)di.shift()(i);0<Vt?Gt=u:(i.calledRun=!0,oe||(_r(),t(i)))}})(),i.PTR_SIZE=4,n}),_c=Qi,xo=globalThis.self?.name?.startsWith("em-pthread"),xo&&Qi()}),Ji,jn,$o,Me,xc,Lr,vo,So,en,To,tn,$c,rn,vc,ha=D(()=>{"use strict";pa(),Ji=typeof location>"u"?void 0:location.origin,jn=import.meta.url>"file:"&&import.meta.url<"file;",$o=()=>{if(jn){let e=URL;return new URL(new e("ort.bundle.min.mjs",import.meta.url).href,Ji).href}return import.meta.url},Me=$o(),xc=()=>{if(Me&&!Me.startsWith("blob:"))return Me.substring(0,Me.lastIndexOf("/")+1)},Lr=(e,t)=>{try{let r=t??Me;return(r?new URL(e,r):new URL(e)).origin===Ji}catch{return!1}},vo=(e,t)=>{let r=t??Me;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},So=(e,t)=>`${t??"./"}${e}`,en=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},To=async e=>(await import(e)).default,tn=(Xy(),yr(yc)).default,$c=async()=>{if(!Me)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Lr(Me))return[void 0,tn()];let e=await en(Me);return[e,tn(e)]},rn=(Yy(),yr(wc)).default,vc=async(e,t,r)=>{if(!e&&!t&&rn&&Me&&Lr(Me))return[void 0,rn];{let i="ort-wasm-simd-threaded.jsep.mjs",n=e??vo(i,t),a=r&&n&&!Lr(n,t),s=a?await en(n):n??So(i,t);return[a?s:void 0,await To(s)]}}}),nn,Ur,rr,an,Io,ko,Eo,fa,me,At=D(()=>{"use strict";ha(),Ur=!1,rr=!1,an=!1,Io=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},ko=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},Eo=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},fa=async e=>{if(Ur)return Promise.resolve();if(rr)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(an)throw new Error("previous call to 'initializeWebAssembly()' failed.");rr=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!Eo())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!ko())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=Io();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let n=e.wasmPaths,a=typeof n=="string"?n:void 0,s=n?.mjs,o=s?.href??s,l=n?.wasm,d=l?.href??l,c=e.wasmBinary,[h,f]=await vc(o,a,r>1),g=!1,m=[];if(t>0&&m.push(new Promise(w=>{setTimeout(()=>{g=!0,w()},t)})),m.push(new Promise((w,v)=>{let x={numThreads:r};if(c)x.wasmBinary=c;else if(d||a)x.locateFile=b=>d??a+b;else if(o&&o.indexOf("blob:")!==0)x.locateFile=b=>new URL(b,o).href;else if(h){let b=xc();b&&(x.locateFile=S=>b+S)}f(x).then(b=>{rr=!1,Ur=!0,nn=b,w(),h&&URL.revokeObjectURL(h)},b=>{rr=!1,an=!0,v(b)})})),await Promise.race(m),g)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},me=()=>{if(Ur&&nn)return nn;throw new Error("WebAssembly is not initialized yet.")}}),je,Jr,he,ma=D(()=>{"use strict";At(),je=(e,t)=>{let r=me(),i=r.lengthBytesUTF8(e)+1,n=r._malloc(i);return r.stringToUTF8(e,n,i),t.push(n),n},Jr=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([n,a])=>{let s=t?t+n:n;if(typeof a=="object")Jr(a,s+".",r,i);else if(typeof a=="string"||typeof a=="number")i(s,a.toString());else if(typeof a=="boolean")i(s,a?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof a}`)})},he=e=>{let t=me(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetLastError(n,n+i);let a=Number(t.getValue(n,i===4?"i32":"i64")),s=t.getValue(n+i,"*"),o=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${a}, ERROR_MESSAGE: ${o}`)}finally{t.stackRestore(r)}}}),Sc,Zy=D(()=>{"use strict";At(),ma(),Sc=e=>{let t=me(),r=0,i=[],n=e||{};try{if(e?.logSeverityLevel===void 0)n.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)n.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(n.terminate=!1);let a=0;return e?.tag!==void 0&&(a=je(e.tag,i)),r=t._OrtCreateRunOptions(n.logSeverityLevel,n.logVerbosityLevel,!!n.terminate,a),r===0&&he("Can't create run options."),e?.extra!==void 0&&Jr(e.extra,"",new WeakSet,(s,o)=>{let l=je(s,i),d=je(o,i);t._OrtAddRunConfigEntry(r,l,d)!==0&&he(`Can't set a run config entry: ${s} - ${o}.`)}),[r,i]}catch(a){throw r!==0&&t._OrtReleaseRunOptions(r),i.forEach(s=>t._free(s)),a}}}),Co,Oo,zo,ir,Ro,Tc,Qy=D(()=>{"use strict";At(),ma(),Co=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},Oo=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},zo=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},ir=(e,t,r,i)=>{let n=je(t,i),a=je(r,i);me()._OrtAddSessionConfigEntry(e,n,a)!==0&&he(`Can't set a session config entry: ${t} - ${r}.`)},Ro=async(e,t,r)=>{for(let i of t){let n=typeof i=="string"?i:i.name,a=[];switch(n){case"webnn":if(n="WEBNN",typeof i!="string"){let c=i?.deviceType;c&&ir(e,"deviceType",c,r)}break;case"webgpu":if(n="JS",typeof i!="string"){let c=i;if(c?.preferredLayout){if(c.preferredLayout!=="NCHW"&&c.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${c.preferredLayout}`);ir(e,"preferredLayout",c.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${n}`)}let s=je(n,r),o=a.length,l=0,d=0;if(o>0){l=me()._malloc(o*me().PTR_SIZE),r.push(l),d=me()._malloc(o*me().PTR_SIZE),r.push(d);for(let c=0;c<o;c++)me().setValue(l+c*me().PTR_SIZE,a[c][0],"*"),me().setValue(d+c*me().PTR_SIZE,a[c][1],"*")}await me()._OrtAppendExecutionProvider(e,s,l,d,o)!==0&&he(`Can't append execution provider: ${n}.`)}},Tc=async e=>{let t=me(),r=0,i=[],n=e||{};zo(n);try{let a=Co(n.graphOptimizationLevel??"all"),s=Oo(n.executionMode??"sequential"),o=typeof n.logId=="string"?je(n.logId,i):0,l=n.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log serverity level is not valid: ${l}`);let d=n.logVerbosityLevel??0;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log verbosity level is not valid: ${d}`);let c=typeof n.optimizedModelFilePath=="string"?je(n.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(a,!!n.enableCpuMemArena,!!n.enableMemPattern,s,!!n.enableProfiling,0,o,l,d,c),r===0&&he("Can't create session options."),n.executionProviders&&await Ro(r,n.executionProviders,i),n.enableGraphCapture!==void 0){if(typeof n.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${n.enableGraphCapture}`);ir(r,"enableGraphCapture",n.enableGraphCapture.toString(),i)}if(n.freeDimensionOverrides)for(let[h,f]of Object.entries(n.freeDimensionOverrides)){if(typeof h!="string")throw new Error(`free dimension override name must be a string: ${h}`);if(typeof f!="number"||!Number.isInteger(f)||f<0)throw new Error(`free dimension override value must be a non-negative integer: ${f}`);let g=je(h,i);t._OrtAddFreeDimensionOverride(r,g,f)!==0&&he(`Can't set a free dimension override: ${h} - ${f}.`)}return n.extra!==void 0&&Jr(n.extra,"",new WeakSet,(h,f)=>{ir(r,h,f,i)}),[r,i]}catch(a){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&he("Can't release session options."),i.forEach(s=>t._free(s)),a}}}),Et,at,Ct,si,ei,ga,ya,Kn,J=D(()=>{"use strict";Et=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},at=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Ct=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((n,a)=>n*a,1);return r>0?Math.ceil(i*r):void 0},si=e=>{switch(e){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},ei=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},ga=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",ya=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Kn=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),ba,Ic=D(()=>{"use strict";pa(),ba=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),a;try{a=new ArrayBuffer(i)}catch(o){if(o instanceof RangeError){let l=Math.ceil(i/65536);a=new WebAssembly.Memory({initial:l,maximum:l}).buffer}else throw o}let s=0;for(;;){let{done:o,value:l}=await n.read();if(o)break;let d=l.byteLength;new Uint8Array(a,s,d).set(l),s+=d}return new Uint8Array(a,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),Mo,Ao,Po,No,wa,Bo,le,st=D(()=>{"use strict";J(),Mo=["V","I","W","E","F"],Ao=(e,t)=>{console.log(`[${Mo[e]},${new Date().toISOString()}]${t}`)},wa=(e,t)=>{Po=e,No=t},Bo=(e,t)=>{let r=ei(e),i=ei(Po);r>=i&&Ao(r,typeof t=="function"?t():t)},le=(...e)=>{No&&Bo(...e)}}),Do,qt,z,ti,kc,Ec,Cc,ne=D(()=>{"use strict";Do=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},qt=class{static calcShape(e,t,r=!1){let i=e.length,n=t.length;if(i===0)return t;if(n===0)return e;let a=Math.max(e.length,t.length),s=new Array(a);if(r){if(i<2||n<2)return;let o=Do.calcMatMulShape([e[i-2],e[i-1]],[t[n-2],t[n-1]]);if(o===void 0)return;[s[a-2],s[a-1]]=o}for(let o=r?3:1;o<=a;o++){let l=i-o<0?1:e[i-o],d=n-o<0?1:t[n-o];if(l!==d&&l>1&&d>1)return;let c=Math.max(l,d);if(l&&d)s[a-o]=Math.max(l,d);else{if(c>1)return;s[a-o]=0}}return s}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let n=1;n<=r;n++)if(e[r-n]!==1&&e[r-n]!==t[i-n])return!1;return!0}},z=class Zr{static size(t){return Zr.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let n=new Array(i),a=i-1;for(;a>=0;){if(t[a]%r===0){n[a]=t[a]/r;break}if(r%t[a]!==0)throw new Error("cannot convert shape");n[a]=1,r/=t[a],a--}for(a--;a>=0;a--)n[a]=t[a];return n}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return Zr.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return Zr.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let n=1;for(let a=r;a<i;a++){if(t[a]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");n*=Number(t[a])}return n}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let n=r-3;n>=0;--n)i[n]=i[n+1]*t[n+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((n,a)=>n+r[a]+r[a+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,n)=>i===r[n])}},ti=class hr{static adjustPoolAttributes(t,r,i,n,a,s){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let o=0;o<r.length-2;o++)o>=i.length?i.push(r[o+2]):i[o]=r[o+2];for(let o=0;o<i.length;o++)if(o<n.length){if(n[o]<0)throw new Error("strides should be greater than or equal to 1")}else n.push(1);for(let o=0;o<i.length;o++)if(o<a.length){if(a[o]<0)throw new Error("dilations should be greater than or equal to 1")}else a.push(1);for(let o=0;o<i.length*2;o++)if(o<s.length){if(s[o]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let o=0;o<i.length;o++){if(i[o]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[o]>=i[o]||s[o+i.length]>=i[o])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,n,a,s,o){if(o){if(a.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<t.length-2;l++)hr.adjustPadAndReturnShape(t[l+(s?1:2)],r[l],i[l],n[l],a,l,l+t.length-2,o)}}static computePoolOutputShape(t,r,i,n,a,s,o){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let l=[r[0],r[1]];return hr.computeShapeHelper(t,r,l,i,n,a,s,o),l}static computeConvOutputShape(t,r,i,n,a,s,o){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],r[0]];return hr.computeShapeHelper(!1,t,l,i,n,a,s,o),l}static computeShapeHelper(t,r,i,n,a,s,o,l){if(t)for(let d=0;d<r.length-2;d++)i.push(1);else for(let d=0;d<r.length-2;d++)i.push(hr.adjustPadAndReturnShape(r[d+2],n[d],a[d],s[d],o,d,d+r.length-2,l))}static adjustPadAndReturnShape(t,r,i,n,a,s,o,l){let d=i*(n-1)+1;if(l&&l!=="NOTSET")switch(l){case"VALID":return a[s]=0,a[o]=0,Math.floor((t-d)/r+1);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let c=((t+r-1)/r-1)*r+n-t;return a[s]=Math.floor(l==="SAME_LOWER"?(c+1)/2:c/2),a[o]=c-a[s],Math.floor((t+c-n)/r+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+a[s]+a[o]-d)/r+1)}},kc=class{static getShapeOfGemmResult(e,t,r,i,n){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let a,s,o;t?(a=e[1],s=e[0]):(a=e[0],s=e[1]);let l=-1;if(i?(o=r[0],l=1):(o=r[1],l=0),r[l]!==s)throw new Error("dimension mismatch");if(a<=0||o<=0||s<=0)throw new Error("invalid shape specified");if(n&&!qt.isValidBroadcast(n,[a,o]))throw new Error("gemm: invalid bias shape for broadcast");return[a,o,s]}},Ec=-34028234663852886e22,Cc=34028234663852886e22}),_a,Oc=D(()=>{"use strict";J(),_a=(e,t)=>new(si(t))(e)}),sn,Xn,on,Lo,un,Uo,ln,dn,cn,Wo,zc,Jy=D(()=>{"use strict";J(),st(),sn=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),Xn=(e,t)=>{if(t==="int32")return e;let r=sn.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let n=e.byteLength/i,a=new(si(t))(e.buffer,e.byteOffset,n);switch(t){case"int64":case"uint64":{let s=new Int32Array(n);for(let o=0;o<n;o++){let l=a[o];if(l>2147483647n||l<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");s[o]=Number(l)}return new Uint8Array(s.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&a.some(o=>o>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let s=Int32Array.from(a,Number);return new Uint8Array(s.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},on=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let n=BigInt64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"uint64":{if(i.some(a=>a<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let n=BigUint64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"int8":{if(i.some(a=>a<-128||a>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let n=Int8Array.from(i,Number);return new Uint8Array(n.buffer)}case"uint8":{if(i.some(n=>n<0||n>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(a=>a<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let n=Uint32Array.from(i,Number);return new Uint8Array(n.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},Lo=1,un=()=>Lo++,Uo=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),ln=(e,t)=>{let r=sn.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,n)=>i*n)*r/8):0},dn=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:n,shape:a,fallbackDataType:s}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=n,this.tensorShape=a,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return ln(this.dataType,this.tensorShape)}destroy(){le("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=on(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return r.buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,n)=>i===r[n])}setIsDataConverted(e){this.isDataConverted=e}},cn=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let n=this.tensorManager.getMLContext(e),a;if(!n.opSupportLimits().input.dataTypes.includes(t)){if(a=Uo.get(t),!a||!n.opSupportLimits().input.dataTypes.includes(a))throw new Error(`WebNN backend does not support data type: ${t}`);le("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${a}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(n,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==ln(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let s=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,s,!0,!0,a),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=Xn(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else le("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){if(this.activeUpload){let t=this.wrapper?.isDataConverted?on(this.activeUpload,this.wrapper?.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(t):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(t);return}else return t.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},Wo=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}reserveTensorId(){let e=un();return this.tensorTrackersById.set(e,new cn(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,n){le("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${n}}`);let a=this.tensorTrackersById.get(t);if(!a)throw new Error("Tensor not found.");return a.ensureTensor(e,r,i,n)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){le("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let n=this.getMLContext(e),a=un(),s=new dn({sessionId:e,context:n,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(a,new cn(this,s)),this.externalTensors.add(s),a}async getCachedTensor(e,t,r,i,n,a,s){let o=this.getMLContext(e);for(let[d,c]of this.freeTensors.entries())if(c.canReuseTensor(o,t,r)){le("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}`);let h=this.freeTensors.splice(d,1)[0];return h.sessionId=e,h}le("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}}`);let l=await o.createTensor({dataType:s??t,shape:r,dimensions:r,usage:i,writable:n,readable:a});return new dn({sessionId:e,context:o,tensor:l,dataType:t,shape:r,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},zc=(...e)=>new Wo(...e)}),nr,qo,Rc,e0=D(()=>{"use strict";J(),At(),Oc(),Jy(),st(),nr=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),qo=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((n,a)=>n===i[a]&&e[n]===t[n])},Rc=class{constructor(e){this.tensorManager=zc(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,wa(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){le("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){le("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)le("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>qo(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(n=>n.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){le("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,n){let a=nr.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,a,i,n)}async createTemporaryTensor(e,t,r){le("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=nr.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let n=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,n,i,r,!1);let a=this.temporarySessionTensorIds.get(e);return a?a.push(n):this.temporarySessionTensorIds.set(e,[n]),n}uploadTensor(e,t){if(!me().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");le("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return _a(r,t)}}registerMLTensor(e,t,r,i){let n=nr.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);let a=this.tensorManager.registerTensor(e,t,n,i);return le("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${n}, dimensions: ${i}} -> {tensorId: ${a}}`),a}registerMLConstant(e,t,r,i,n,a,s=!1){if(!a)throw new Error("External mounted files are not available.");let o=e;e.startsWith("./")&&(o=e.substring(2));let l=a.get(o);if(!l)throw new Error(`File with name ${o} not found in preloaded files.`);if(t+r>l.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let d=l.slice(t,t+r).buffer,c;switch(n.dataType){case"float32":c=new Float32Array(d);break;case"float16":c=typeof Float16Array<"u"&&Float16Array.from?new Float16Array(d):new Uint16Array(d);break;case"int32":c=new Int32Array(d);break;case"uint32":c=new Uint32Array(d);break;case"int64":if(s){let h=Xn(new Uint8Array(d),"int64");c=new Int32Array(h.buffer),n.dataType="int32"}else c=new BigInt64Array(d);break;case"uint64":c=new BigUint64Array(d);break;case"int8":c=new Int8Array(d);break;case"int4":case"uint4":case"uint8":c=new Uint8Array(d);break;default:throw new Error(`Unsupported data type: ${n.dataType} in creating WebNN Constant from external data.`)}return le("verbose",()=>`[WebNN] registerMLConstant {dataType: ${n.dataType}, shape: ${n.shape}}} ${s?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),i.constant(n,c)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=this.mlContextBySessionId.get(e),n=nr.get(Et(t));return typeof n>"u"?!1:r?!!i?.opSupportLimits().input.dataTypes.includes(n):!!i?.opSupportLimits().output.dataTypes.includes(n)}flush(){}}}),xa=D(()=>{"use strict"}),pn,Wr,qr,Ho,Fo,hn,Yn,Vo,Mc,t0=D(()=>{"use strict";st(),xa(),pn=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Wr=[],qr=e=>Math.ceil(Number(e)/16)*16,Ho=e=>{for(let t=0;t<Wr.length;t++){let r=Wr[t];if(e<=r)return r}return Math.ceil(e/16)*16},Fo=1,hn=()=>Fo++,Yn=async(e,t,r,i)=>{let n=qr(r),a=e.device.createBuffer({size:n,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,a,0,n),e.flush(),await a.mapAsync(GPUMapMode.READ);let o=a.getMappedRange();if(i){let l=i();return l.set(new Uint8Array(o,0,r)),l}else return new Uint8Array(o.slice(0,r))}finally{a.destroy()}},Vo=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of pn)Wr.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,n=t.byteLength,a=qr(n),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==n)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${n}`);let o=this.backend.device.createBuffer({mappedAtCreation:!0,size:a,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),l=o.getMappedRange();new Uint8Array(l).set(new Uint8Array(r,i,n)),o.unmap();let d=this.backend.device.createCommandEncoder();d.copyBufferToBuffer(o,0,s.gpuData.buffer,0,a),this.backend.device.queue.submit([d.finish()]),o.destroy(),le("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let n=qr(r.originalSize),a=this.backend.getCommandEncoder();this.backend.endComputePass(),a.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,n)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return le("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=hn();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),le("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),le("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=Ho(e),i,n=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,a=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(n||a){let o=(n?this.freeBuffers:this.freeUniformBuffers).get(r);o?o.length>0?i=o.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let s={id:hn(),type:0,buffer:i};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),le("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return le("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await Yn(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=pn.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(le("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},Mc=(...e)=>new Vo(...e)}),Go,pe,_e=D(()=>{"use strict";Go=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},pe=e=>new Go(e)}),Ht,Hr,Se,ke,Y,we,Zn,Wt,gt,G,ar,A,V,Ac,$a,jo,Pc,ae=D(()=>{"use strict";J(),ne(),Ht=64,Hr=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},Se=(e,t=1)=>{let r=Hr(e,t);return typeof r=="string"?r:r[0]},ke=(e,t=1)=>{let r=Hr(e,t);return typeof r=="string"?r:r[1]},Y=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:z.computeStrides(r)})}),t},we=e=>e%4===0?4:e%2===0?2:1,Zn=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,Wt=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,gt=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,G=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,ar=(e,t,r,i,n)=>{let a=typeof r=="number",s=a?r:r.length,o=[...new Array(s).keys()],l=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,d=Hr(t,n),c=typeof d=="string"?d:d[1],h=typeof d=="string"?d:d[0],f={indices:l,value:c,storage:h,tensor:t},g=P=>typeof P=="string"?P:`${P}u`,m={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},w=a?"uniforms.":"",v=`${w}${e}_shape`,x=`${w}${e}_strides`,b="";for(let P=0;P<s-1;P++)b+=`
    let dim${P} = current / ${G(x,P,s)};
    let rest${P} = current % ${G(x,P,s)};
    indices[${P}] = dim${P};
    current = rest${P};
    `;b+=`indices[${s-1}] = current;`;let S=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${f.indices} {
    var indices: ${f.indices};
    var current = offset;
    ${b}
    return indices;
  }`,T=P=>(m.offsetToIndices=!0,s<2?P:`o2i_${e}(${P})`),I=[];if(s>=2)for(let P=s-1;P>=0;P--)I.push(`${G(x,P,s)} * (indices[${P}])`);let C=s<2?"":`
  fn i2o_${e}(indices: ${f.indices}) -> u32 {
    return ${I.join("+")};
  }`,k=P=>(m.indicesToOffset=!0,s<2?P:`i2o_${e}(${P})`),O=(...P)=>s===0?"0u":`${f.indices}(${P.map(g).join(",")})`,N=(P,W)=>s<2?`${P}`:`${G(P,W,s)}`,L=(P,W,te)=>s<2?`${P}=${te};`:`${G(P,W,s)}=${te};`,X={},F=(P,W)=>{m.broadcastedIndicesToOffset=!0;let te=`${W.name}broadcastedIndicesTo${e}Offset`;if(te in X)return`${te}(${P})`;let R=[];for(let ie=s-1;ie>=0;ie--){let Ee=W.indicesGet("outputIndices",ie+W.rank-s);R.push(`${N(x,ie)} * (${Ee} % ${N(v,ie)})`)}return X[te]=`fn ${te}(outputIndices: ${W.type.indices}) -> u32 {
             return ${R.length>0?R.join("+"):"0u"};
           }`,`${te}(${P})`},ee=(P,W)=>(()=>{if(f.storage===f.value)return`${e}[${P}]=${W};`;if(f.storage==="vec2<u32>"&&f.value==="i32")return`${e}[${P}]=vec2<u32>(u32(${W}), select(0u, 0xFFFFFFFFu, ${W} < 0));`;if(f.storage==="vec2<u32>"&&f.value==="u32")return`${e}[${P}]=vec2<u32>(u32(${W}), 0u);`;if(f.storage==="u32"&&f.value==="vec4<bool>")return`${e}[${P}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${W}));`;throw new Error(`not supported combination of storage type ${f.storage} and value type ${f.value} yet`)})(),U=P=>(()=>{if(f.storage===f.value)return`${e}[${P}]`;if(f.storage==="vec2<u32>"&&f.value==="i32")return`i32(${e}[${P}].x)`;if(f.storage==="vec2<u32>"&&f.value==="u32")return`u32(${e}[${P}].x)`;if(f.storage==="u32"&&f.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${P}] & 0xFFu), bool(${e}[${P}] & 0xFF00u), bool(${e}[${P}] & 0xFF0000u), bool(${e}[${P}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${f.storage} and value type ${f.value} yet`)})(),re=s<2?"":`
  fn get_${e}ByIndices(indices: ${f.indices}) -> ${c} {
    return ${U(`i2o_${e}(indices)`)};
  }`,Z=s<2?"":(()=>{let P=o.map(te=>`d${te}: u32`).join(", "),W=o.map(te=>`d${te}`).join(", ");return`
  fn get_${e}(${P}) -> ${c} {
    return get_${e}ByIndices(${O(W)});
  }`})(),H=(...P)=>{if(P.length!==s)throw new Error(`indices length must be ${s}`);let W=P.map(g).join(",");return s===0?U("0u"):s===1?U(W[0]):(m.get=!0,m.getByIndices=!0,m.indicesToOffset=!0,`get_${e}(${W})`)},oe=P=>s<2?U(P):(m.getByIndices=!0,m.indicesToOffset=!0,`get_${e}ByIndices(${P})`),j=s<2?"":`
  fn set_${e}ByIndices(indices: ${f.indices}, value: ${c}) {
    ${ee(`i2o_${e}(indices)`,"value")}
  }`,ue=s<2?"":(()=>{let P=o.map(te=>`d${te}: u32`).join(", "),W=o.map(te=>`d${te}`).join(", ");return`
  fn set_${e}(${P}, value: ${c}) {
    set_${e}ByIndices(${O(W)}, value);
  }`})();return{impl:()=>{let P=[],W=!1;return m.offsetToIndices&&(P.push(S),W=!0),m.indicesToOffset&&(P.push(C),W=!0),m.broadcastedIndicesToOffset&&(Object.values(X).forEach(te=>P.push(te)),W=!0),m.set&&(P.push(ue),W=!0),m.setByIndices&&(P.push(j),W=!0),m.get&&(P.push(Z),W=!0),m.getByIndices&&(P.push(re),W=!0),!a&&W&&P.unshift(`const ${v} = ${f.indices}(${r.join(",")});`,`const ${x} = ${f.indices}(${z.computeStrides(r).join(",")});`),P.join(`
`)},type:f,offsetToIndices:T,indicesToOffset:k,broadcastedIndicesToOffset:F,indices:O,indicesGet:N,indicesSet:L,set:(...P)=>{if(P.length!==s+1)throw new Error(`indices length must be ${s}`);let W=P[s];if(typeof W!="string")throw new Error("value must be string");let te=P.slice(0,s).map(g).join(",");return s===0?ee("0u",W):s===1?ee(te[0],W):(m.set=!0,m.setByIndices=!0,m.indicesToOffset=!0,`set_${e}(${te}, ${W})`)},setByOffset:ee,setByIndices:(P,W)=>s<2?ee(P,W):(m.setByIndices=!0,m.indicesToOffset=!0,`set_${e}ByIndices(${P}, ${W});`),get:H,getByOffset:U,getByIndices:oe,usage:i,name:e,strides:x,shape:v,rank:s}},A=(e,t,r,i=1)=>ar(e,t,r,"input",i),V=(e,t,r,i=1)=>ar(e,t,r,"output",i),Ac=(e,t,r)=>ar(e,t,r,"atomicOutput",1),$a=(e,t,r,i=1)=>ar(e,t,r,"internal",i),jo=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=Ht){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let n=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,a=n?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=n?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*i}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${i})
  fn main(${a}) {
    ${s}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",i=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${i}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:i}of this.uniforms)if(i&&i>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(i/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(i/4)}>`);else{let n=i==null||i===1?r:`vec${i}<${r}>`;e.push(`${t}:${n}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},Pc=(e,t)=>new jo(e,t)}),Ko,fn,Xo,Yo,Zo,Qo,Pe,Nc,Bc,yt=D(()=>{"use strict";J(),ne(),_e(),ae(),Ko=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},fn=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),Xo=(e,t)=>z.sortBasedOnPerm(e,fn(e.length,t)),Yo=(e,t,r,i)=>{let n=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let a=0;a<t;++a)n+=`a[${e[a]}]=i[${a}];`;return n+="return a;}"},Zo=(e,t)=>{let r=[],i=[];for(let n=0;n<e.length;++n)e[n]!==1&&r.push(e[n]),e[t[n]]!==1&&i.push(t[n]);return{newShape:r,newPerm:i}},Qo=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},Pe=(e,t)=>{let r=e.dataType,i=e.dims.length,n=fn(i,t),a=Xo(e.dims,n),s=e.dims,o=a,l=i<2||Qo(n,e.dims),d;if(l)return d=m=>{let w=A("input",r,s,4),v=V("output",r,o,4);return`
  ${m.registerUniform("output_size","u32").declareVariables(w,v)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let m=z.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(m/64/4)},programUniforms:[{type:12,data:Math.ceil(m/4)}]}},getShaderSource:d};let{newShape:c,newPerm:h}=Zo(e.dims,n),f=z.areEqual(h,[2,3,1]),g=z.areEqual(h,[3,1,2]);if(c.length===2||f||g){s=f?[c[0],c[1]*c[2]]:g?[c[0]*c[1],c[2]]:c,o=[s[1],s[0]];let m=16;return d=w=>{let v=A("a",r,s.length),x=V("output",r,o.length);return`
  ${w.registerUniform("output_size","u32").declareVariables(v,x)}
  var<workgroup> tile : array<array<${x.type.value}, ${m+1}>, ${m}>;
  ${w.mainStart([m,m,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${m} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${m}u + local_id.x;
    let input_row = workgroup_id_x * ${m}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${v.getByIndices(`${v.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${m}u + local_id.x;
    let output_row = workgroup_id_y * ${m}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${x.setByIndices(`${x.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let w=z.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(o[1]/m),y:Math.ceil(o[0]/m)},programUniforms:[{type:12,data:w},...Y(s,o)]}},getShaderSource:d}}return d=m=>{let w=A("a",r,s.length),v=V("output",r,o.length);return`
  ${m.registerUniform("output_size","u32").declareVariables(w,v)}

  ${Yo(n,i,w,v)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${v.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${v.setByOffset("global_idx",w.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let m=z.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},...Y(s,o)]}},getShaderSource:d}},Nc=(e,t)=>{Ko(e.inputs,t.perm),e.compute(Pe(e.inputs[0],t.perm))},Bc=e=>pe({perm:e.perm})}),Jo,eu,tu,ru,iu,nu,au,su,ou,uu,qe,Dc,Lc,Uc,Wc,qc,Hc,Fc,Vc,Gc,jc,r0=D(()=>{"use strict";J(),ne(),ae(),va(),yt(),Jo={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},eu={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},tu={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},ru={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},iu=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},nu=(e,t)=>{let r=[],i=e.length;for(let a=0;a<i;a++)t.indexOf(a)===-1&&r.push(e[a]);let n=t.map(a=>e[a]);return[r,n]},au=(e,t)=>{let r=e.length+t.length,i=[],n=0;for(let a=0;a<r;a++)t.indexOf(a)===-1?i.push(e[n++]):i.push(1);return i},su=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},ou=(e,t)=>{let r=[];if(!su(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},uu=(e,t,r,i,n,a,s)=>{let o=r[0].dims,l=z.size(a),d=z.size(s),c=A("_A",r[0].dataType,o),h=V("output",n,a),f=64;l===1&&(f=256);let g=`
          var<workgroup> aBestValues : array<f32, ${f}>;
       `,m=w=>`
        ${w.registerUniform("reduceSize","u32").declareVariables(c,h)}
        ${g}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${w.mainStart(f)}

          let outputIndex = global_idx / ${f};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${tu[i]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${f}) {
           let candidate = f32(${c.getByOffset("offset + k")});
           bestValue = ${Jo[i]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${f}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${eu[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${h.setByOffset("outputIndex",`${i==="mean"?`${h.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${h.type.storage}(${ru[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${f}`,inputDependencies:["type"]},getShaderSource:m,getRunData:()=>({outputs:[{dims:a,dataType:n}],dispatchGroup:{x:l},programUniforms:[{type:12,data:d}]})}},qe=(e,t,r,i)=>{let n=e.inputs.length===1?r:Qn(e.inputs,r),a=n.axes;a.length===0&&!n.noopWithEmptyAxes&&(a=e.inputs[0].dims.map((g,m)=>m));let s=z.normalizeAxes(a,e.inputs[0].dims.length),o=s,l=e.inputs[0],d=ou(o,e.inputs[0].dims.length);d.length>0&&(l=e.compute(Pe(e.inputs[0],d),{inputs:[0],outputs:[-1]})[0],o=iu(o.length,l.dims.length));let[c,h]=nu(l.dims,o),f=c;n.keepDims&&(f=au(c,s)),e.compute(uu(t,n.cacheKey,[l],i,e.inputs[0].dataType,f,h),{inputs:[l]})},Dc=(e,t)=>{qe(e,"ReduceMeanShared",t,"mean")},Lc=(e,t)=>{qe(e,"ReduceL1Shared",t,"l1")},Uc=(e,t)=>{qe(e,"ReduceL2Shared",t,"l2")},Wc=(e,t)=>{qe(e,"ReduceLogSumExpShared",t,"logSumExp")},qc=(e,t)=>{qe(e,"ReduceMaxShared",t,"max")},Hc=(e,t)=>{qe(e,"ReduceMinShared",t,"min")},Fc=(e,t)=>{qe(e,"ReduceProdShared",t,"prod")},Vc=(e,t)=>{qe(e,"ReduceSumShared",t,"sum")},Gc=(e,t)=>{qe(e,"ReduceSumSquareShared",t,"sumSquare")},jc=(e,t)=>{qe(e,"ReduceLogSumShared",t,"logSum")}}),He,lu,ri,Qn,Fe,du,cu,pu,hu,fu,mu,gu,yu,bu,wu,Ve,Kc,Xc,Yc,Zc,Qc,Jc,ep,tp,rp,ip,va=D(()=>{"use strict";J(),ne(),_e(),ae(),r0(),He=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},lu=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],ri=(e,t,r,i,n,a,s=!1,o=!1)=>{let l=[],d=r[0].dims,c=d.length,h=z.normalizeAxes(n,c),f=!o&&h.length===0;d.forEach((w,v)=>{f||h.indexOf(v)>=0?s&&l.push(1):l.push(w)});let g=l.length,m=z.size(l);return{name:e,shaderCache:t,getShaderSource:w=>{let v=[],x=A("_A",r[0].dataType,c),b=V("output",a,g),S=i(x,b,h),T=S[2];for(let I=0,C=0;I<c;I++)f||h.indexOf(I)>=0?(s&&C++,T=`for(var j${I}: u32 = 0; j${I} < ${d[I]}; j${I}++) {
                  ${S[2].includes("last_index")?`let last_index = j${I};`:""}
                  ${x.indicesSet("input_indices",I,`j${I}`)}
                  ${T}
                }`):(v.push(`${x.indicesSet("input_indices",I,b.indicesGet("output_indices",C))};`),C++);return`

        ${w.registerUniform("output_size","u32").declareVariables(x,b)}

        ${w.mainStart()}
          ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${x.type.indices};
          let output_indices = ${b.offsetToIndices("global_idx")};

          ${v.join(`
`)}
          ${S[0]}       // init ops for reduce max/min
          ${S[1]}
          ${T}
          ${S[3]}
          ${S.length===4?b.setByOffset("global_idx","value"):S.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:a}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},...Y(d,l)]})}},Qn=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),pe({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},Fe=(e,t,r,i)=>{let n=e.inputs,a=n.length===1?r:Qn(n,r);e.compute(ri(t,{hint:a.cacheKey,inputDependencies:["rank"]},[n[0]],a.noopWithEmptyAxes&&a.axes.length===0?lu:i,a.axes,n[0].dataType,a.keepDims,a.noopWithEmptyAxes),{inputs:[0]})},du=(e,t)=>{He(e.inputs),Fe(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},cu=(e,t)=>{He(e.inputs),Fe(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},pu=(e,t)=>{He(e.inputs),Fe(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},hu=(e,t)=>{He(e.inputs),Fe(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},fu=(e,t)=>{He(e.inputs),Fe(e,"ReduceMax",t,(r,i,n)=>{let a=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&a.push(r.indicesSet("input_indices",s,0));return[`${a.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},mu=(e,t)=>{He(e.inputs),Fe(e,"ReduceMean",t,(r,i,n)=>{let a=1;for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&(a*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${a});`]})},gu=(e,t)=>{He(e.inputs),Fe(e,"ReduceMin",t,(r,i,n)=>{let a=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&a.push(`input_indices[${s}] = 0;`);return[`${a.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},yu=(e,t)=>{He(e.inputs),Fe(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},bu=(e,t)=>{He(e.inputs),Fe(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},wu=(e,t)=>{He(e.inputs),Fe(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},Ve=(e,t,r)=>{if(t.length===0)return r;let i=1,n=1;for(let a=0;a<t.length;a++)t.indexOf(a)===-1?i*=e[a]:n*=e[a];return n<32&&i>1024},Kc=(e,t)=>{Ve(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?mu(e,t):Dc(e,t)},Xc=(e,t)=>{Ve(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?cu(e,t):Lc(e,t)},Yc=(e,t)=>{Ve(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?pu(e,t):Uc(e,t)},Zc=(e,t)=>{Ve(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?hu(e,t):Wc(e,t)},Qc=(e,t)=>{Ve(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?fu(e,t):qc(e,t)},Jc=(e,t)=>{Ve(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?gu(e,t):Hc(e,t)},ep=(e,t)=>{Ve(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?yu(e,t):Fc(e,t)},tp=(e,t)=>{Ve(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?bu(e,t):Vc(e,t)},rp=(e,t)=>{Ve(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?wu(e,t):Gc(e,t)},ip=(e,t)=>{Ve(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?du(e,t):jc(e,t)}}),mn,np,ap,Jn,i0=D(()=>{"use strict";J(),_e(),va(),mn=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},np=(e,t)=>{mn(e.inputs);let r=(i,n,a)=>{let s=[];for(let o=0;o<i.rank;o++)(a.indexOf(o)>=0||a.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(ri("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},ap=(e,t)=>{mn(e.inputs);let r=(i,n,a)=>{let s=[];for(let o=0;o<i.rank;o++)(a.indexOf(o)>=0||a.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(ri("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Jn=e=>pe(e)}),_u,Fr,xu,$u,vu,wr,Su,sp,Sa=D(()=>{"use strict";J(),ne(),xa(),ae(),_u=(e,t)=>{let r=e[0],i=e[1],n=e[2],a=e[3],s=e[4],o=e[5];if(s&&o)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let l=r.dims[0],d=r.dims[1],c=r.dims[2];if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==c)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(n.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let h=n.dims[0]/3,f=h,g=f;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let S of t.qkvHiddenSizes)if(S%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");h=t.qkvHiddenSizes[0],f=t.qkvHiddenSizes[1],g=t.qkvHiddenSizes[2]}let m=d;if(h!==f)throw new Error("qkv_hidden_sizes first element should be same as the second");if(n.dims[0]!==h+f+g)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let w=0;if(s){if(f!==g)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==l)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==f/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(w=s.dims[3])}let v=m+w,x=-1,b=0;if(a)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(o){if(o.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(o.dims[0]!==l||o.dims[1]!==t.numHeads||o.dims[2]!==d||o.dims[3]!==v)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:d,pastSequenceLength:w,kvSequenceLength:m,totalSequenceLength:v,maxSequenceLength:x,inputHiddenSize:c,hiddenSize:h,vHiddenSize:g,headSize:Math.floor(h/t.numHeads),vHeadSize:Math.floor(g/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Fr=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,xu=(e,t,r,i,n,a,s,o)=>{let l=we(s?1:a),d=64,c=a/l;c<d&&(d=32);let h=Math.ceil(a/l/d),f=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:n},{type:12,data:c},{type:12,data:h}],g=Se(e.dataType,l),m=ke(1,l),w=["type"];s&&w.push("type"),o&&w.push("type");let v=x=>{let b=V("x",e.dataType,e.dims,l),S=[b],T=s?A("seq_lens",s.dataType,s.dims):void 0;T&&S.push(T);let I=o?A("total_sequence_length_input",o.dataType,o.dims):void 0;I&&S.push(I);let C=ke(e.dataType),k=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${d}>;
  var<workgroup> thread_sum: array<f32, ${d}>;
  ${x.registerUniforms(k).declareVariables(...S)}
  ${x.mainStart([d,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Fr(T,I,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${d}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${m}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${m}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(l){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${d}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${m}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${m}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(l){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${d}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${b.type.value}(${C}(1.0) / ${C}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${m}(x[offset + i]);
        x[offset + i] = ${b.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${b.type.value}(${C}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${d};${g};${l}`,inputDependencies:w},getShaderSource:v,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:n,z:t*r},programUniforms:f})}},$u=(e,t,r,i,n,a,s,o,l)=>{let d=s+a.kvSequenceLength,c=[a.batchSize,a.numHeads,a.sequenceLength,d],h=e>1&&i,f=a.kvNumHeads?a.kvNumHeads:a.numHeads,g=h?[a.batchSize,f,d,a.headSize]:void 0,m=a.nReps?a.nReps:1,w=a.scale===0?1/Math.sqrt(a.headSize):a.scale,v=we(a.headSize),x=a.headSize/v,b=12,S={x:Math.ceil(d/b),y:Math.ceil(a.sequenceLength/b),z:a.batchSize*a.numHeads},T=[{type:12,data:a.sequenceLength},{type:12,data:x},{type:12,data:d},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:1,data:w},{type:12,data:s},{type:12,data:a.kvSequenceLength},{type:12,data:m}],I=h&&i&&z.size(i.dims)>0,C=["type","type"];I&&C.push("type"),n&&C.push("type"),o&&C.push("type"),l&&C.push("type");let k=[{dims:c,dataType:t.dataType,gpuDataType:0}];h&&k.push({dims:g,dataType:t.dataType,gpuDataType:0});let O=N=>{let L=A("q",t.dataType,t.dims,v),X=A("key",r.dataType,r.dims,v),F=[L,X];if(I){let j=A("past_key",i.dataType,i.dims,v);F.push(j)}n&&F.push(A("attention_bias",n.dataType,n.dims));let ee=o?A("seq_lens",o.dataType,o.dims):void 0;ee&&F.push(ee);let U=l?A("total_sequence_length_input",l.dataType,l.dims):void 0;U&&F.push(U);let re=V("output",t.dataType,c),Z=[re];h&&Z.push(V("present_key",t.dataType,g,v));let H=ke(1,v),oe=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;

  var<workgroup> tileQ: array<${L.type.storage}, ${b*b}>;
  var<workgroup> tileK: array<${L.type.storage}, ${b*b}>;
  ${N.registerUniforms(oe).declareVariables(...F,...Z)}
  ${N.mainStart([b,b,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${m===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${m===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Fr(ee,U,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${I&&h?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${h?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${H}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${I&&h?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${h?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${H}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(v){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${v}`)}})()};
        output[outputIdx] = ${re.type.value} (sum * uniforms.alpha) + ${n?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${v};${n!==void 0};${i!==void 0};${e}`,inputDependencies:C},getRunData:()=>({outputs:k,dispatchGroup:S,programUniforms:T}),getShaderSource:O}},vu=(e,t,r,i,n,a,s=void 0,o=void 0)=>{let l=a+n.kvSequenceLength,d=n.nReps?n.nReps:1,c=n.vHiddenSize*d,h=e>1&&i,f=n.kvNumHeads?n.kvNumHeads:n.numHeads,g=h?[n.batchSize,f,l,n.headSize]:void 0,m=[n.batchSize,n.sequenceLength,c],w=12,v={x:Math.ceil(n.vHeadSize/w),y:Math.ceil(n.sequenceLength/w),z:n.batchSize*n.numHeads},x=[{type:12,data:n.sequenceLength},{type:12,data:l},{type:12,data:n.vHeadSize},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:12,data:c},{type:12,data:a},{type:12,data:n.kvSequenceLength},{type:12,data:d}],b=h&&i&&z.size(i.dims)>0,S=["type","type"];b&&S.push("type"),s&&S.push("type"),o&&S.push("type");let T=[{dims:m,dataType:t.dataType,gpuDataType:0}];h&&T.push({dims:g,dataType:t.dataType,gpuDataType:0});let I=C=>{let k=A("probs",t.dataType,t.dims),O=A("v",r.dataType,r.dims),N=[k,O];b&&N.push(A("past_value",i.dataType,i.dims));let L=s?A("seq_lens",s.dataType,s.dims):void 0;s&&N.push(L);let X=o?A("total_sequence_length_input",o.dataType,o.dims):void 0;o&&N.push(X);let F=[V("output",t.dataType,m)];h&&F.push(V("present_value",t.dataType,g));let ee=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;
  var<workgroup> tileQ: array<${k.type.value}, ${w*w}>;
  var<workgroup> tileV: array<${k.type.value}, ${w*w}>;
  ${C.registerUniforms(ee).declareVariables(...N,...F)}
  ${C.mainStart([w,w,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${d===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${d===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Fr(L,X,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${b&&h?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${h?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${k.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${b&&h?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${h?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:S},getRunData:()=>({outputs:T,dispatchGroup:v,programUniforms:x}),getShaderSource:I}},wr=(e,t,r,i,n,a,s,o,l,d,c=void 0,h=void 0)=>{let f=Math.min(e.outputCount,1+(s?1:0)+(o?1:0)),g=f>1?d.pastSequenceLength:0,m=g+d.kvSequenceLength,w=l&&z.size(l.dims)>0?l:void 0,v=[t,r];f>1&&s&&z.size(s.dims)>0&&v.push(s),w&&v.push(w),c&&v.push(c),h&&v.push(h);let x=e.compute($u(f,t,r,s,w,d,g,c,h),{inputs:v,outputs:f>1?[-1,1]:[-1]})[0];e.compute(xu(x,d.batchSize,d.numHeads,g,d.sequenceLength,m,c,h),{inputs:c&&h?[x,c,h]:[x],outputs:[]});let b=[x,i];f>1&&o&&z.size(o.dims)>0&&b.push(o),c&&b.push(c),h&&b.push(h),e.compute(vu(f,x,i,o,d,g,c,h),{inputs:b,outputs:f>1?[0,2]:[0]})},Su=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,n=t.inputHiddenSize,a=t.headSize,s=12,o={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},l=[e.inputs[0],e.inputs[1],e.inputs[2]],d=[{type:12,data:i},{type:12,data:n},{type:12,data:a},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],c=h=>{let f=V("output_q",l[0].dataType,r),g=V("output_k",l[0].dataType,r),m=V("output_v",l[0].dataType,r),w=A("input",l[0].dataType,l[0].dims),v=A("weight",l[1].dataType,l[1].dims),x=A("bias",l[2].dataType,l[2].dims),b=w.type.storage,S=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${b}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${b}, ${s*s}>;
  var<workgroup> tileWeightK: array<${b}, ${s*s}>;
  var<workgroup> tileWeightV: array<${b}, ${s*s}>;
  ${h.registerUniforms(S).declareVariables(w,v,x,f,g,m)}
  ${h.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${b}(0);
    var valueK = ${b}(0);
    var valueV = ${b}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:o,programUniforms:d}),getShaderSource:c},{inputs:l,outputs:[-1,-1,-1]})},sp=(e,t)=>{let r=_u(e.inputs,t),[i,n,a]=Su(e,r);return wr(e,i,n,a,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),Tu,Iu,ku,op,n0=D(()=>{"use strict";Ye(),J(),ne(),_e(),ae(),Tu=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,n,a)=>{let s=n.length;if(s!==i.length)throw new Error(`${a}: num dimensions != ${s}`);n.forEach((o,l)=>{if(o!==i[l])throw new Error(`${a}: dim[${l}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},Iu=(e,t)=>{let{epsilon:r,spatial:i,format:n}=t,a=e[0].dims,s=i?we(a[a.length-1]):1,o=n==="NHWC"&&a.length>1?s:1,l=z.size(a)/s,d=i,c=d?a.length:a,h=A("x",e[0].dataType,e[0].dims,s),f=A("scale",e[1].dataType,e[1].dims,o),g=A("bias",e[2].dataType,e[2].dims,o),m=A("inputMean",e[3].dataType,e[3].dims,o),w=A("inputVar",e[4].dataType,e[4].dims,o),v=V("y",e[0].dataType,c,s),x=()=>{let S="";if(i)S=`let cOffset = ${a.length===1?"0u":n==="NHWC"?`outputIndices[${a.length-1}] / ${s}`:"outputIndices[1]"};`;else if(n==="NCHW")S=`
            ${v.indicesSet("outputIndices","0","0")}
            let cOffset = ${v.indicesToOffset("outputIndices")};`;else{S=`var cIndices = ${f.type.indices}(0);
                       cIndices[0] = outputIndices[${a.length-1}];`;for(let T=1;T<f.rank;T++)S+=`cIndices[${T}] = outputIndices[${T}];`;S+=`let cOffset = ${f.indicesToOffset("cIndices")};`}return S},b=S=>`
  const epsilon = ${r};
  ${S.registerUniform("outputSize","u32").declareVariables(h,f,g,m,w,v)}
  ${S.mainStart()}
  ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${v.offsetToIndices(`global_idx * ${s}`)};
    ${x()}
    let scale = ${f.getByOffset("cOffset")};
    let bias = ${g.getByOffset("cOffset")};
    let inputMean = ${m.getByOffset("cOffset")};
    let inputVar = ${w.getByOffset("cOffset")};
    let x = ${h.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${v.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${s}`,inputDependencies:d?["rank","type","type","type","type"]:void 0},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d?[{type:12,data:l},...Y(a)]:[{type:12,data:l}]})}},ku=e=>pe(e),op=(e,t)=>{let{inputs:r,outputCount:i}=e,n=ku({...t,outputCount:i});if(ge.webgpu.validateInputContent&&Tu(r,n),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(Iu(r,n))}}),Eu,Cu,up,a0=D(()=>{"use strict";ne(),ae(),Eu=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Cu=e=>{let t=e[0].dims,r=e[0].dims[2],i=z.size(t)/4,n=e[0].dataType,a=A("input",n,t,4),s=A("bias",n,[r],4),o=A("residual",n,t,4),l=V("output",n,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:d=>`
  const channels = ${r}u / 4;
  ${d.declareVariables(a,s,o,l)}

  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${a.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${o.getByOffset("global_idx")};
    ${l.setByOffset("global_idx","value")}
  }`}},up=e=>{Eu(e.inputs),e.compute(Cu(e.inputs))}}),Ou,ce,lp,dp,cp,pp,hp,fp,mp,gp,yp,zu,bp,wp,_p,xp,fr,$p,Qr,vp,Sp,Tp,Ip,kp,Ep,Cp,Op,zp,Rp,Mp,Ap,Pp,Np,Bp,Dp,gn,Lp,ea,ta,Up,Wp,qp,Ru,Mu,Hp,Ta=D(()=>{"use strict";J(),ne(),_e(),ae(),Ou=(e,t,r,i,n,a,s)=>{let o=Math.ceil(t/4),l="";typeof n=="string"?l=`${n}(a)`:l=n("a");let d=A("inputData",r,[o],4),c=V("outputData",i,[o],4),h=[{name:"vec_size",type:"u32"}];return s&&h.push(...s),`
      ${e.registerUniforms(h).declareVariables(d,c)}

  ${a??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${d.getByOffset("global_idx")};
    ${c.setByOffset("global_idx",l)}
  }`},ce=(e,t,r,i,n,a=e.dataType,s,o)=>{let l=[{type:12,data:Math.ceil(z.size(e.dims)/4)}];return s&&l.push(...s),{name:t,shaderCache:{hint:n,inputDependencies:["type"]},getShaderSource:d=>Ou(d,z.size(e.dims),e.dataType,a,r,i,o),getRunData:d=>({outputs:[{dims:e.dims,dataType:a}],dispatchGroup:{x:Math.ceil(z.size(d[0].dims)/64/4)},programUniforms:l})}},lp=e=>{e.compute(ce(e.inputs[0],"Abs","abs"))},dp=e=>{e.compute(ce(e.inputs[0],"Acos","acos"))},cp=e=>{e.compute(ce(e.inputs[0],"Acosh","acosh"))},pp=e=>{e.compute(ce(e.inputs[0],"Asin","asin"))},hp=e=>{e.compute(ce(e.inputs[0],"Asinh","asinh"))},fp=e=>{e.compute(ce(e.inputs[0],"Atan","atan"))},mp=e=>{e.compute(ce(e.inputs[0],"Atanh","atanh"))},gp=e=>pe(e),yp=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(ce(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},zu=e=>{let t,r,i=e.length>=2&&e[1].data!==0,n=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=n?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=n?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return pe({min:t,max:r})},bp=(e,t)=>{let r=t||zu(e.inputs),i=ke(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Clip",n=>`clamp(${n}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},wp=e=>{e.compute(ce(e.inputs[0],"Ceil","ceil"))},_p=e=>{e.compute(ce(e.inputs[0],"Cos","cos"))},xp=e=>{e.compute(ce(e.inputs[0],"Cosh","cosh"))},fr=e=>pe(e),$p=(e,t)=>{let r=ke(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Qr=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,vp=e=>{let t=ke(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,Qr(t)))},Sp=e=>{e.compute(ce(e.inputs[0],"Exp","exp"))},Tp=e=>{e.compute(ce(e.inputs[0],"Floor","floor"))},Ip=e=>{let t=ke(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,Qr(t)))},kp=(e,t)=>{let r=ke(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},Ep=e=>{e.compute(ce(e.inputs[0],"Not",t=>`!${t}`))},Cp=e=>{e.compute(ce(e.inputs[0],"Neg",t=>`-${t}`))},Op=e=>{e.compute(ce(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},zp=e=>{let t=ke(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},Rp=e=>{e.compute(ce(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},Mp=e=>pe(e),Ap=(e,t)=>{let r=ke(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},Pp=e=>{e.compute(ce(e.inputs[0],"Sin","sin"))},Np=e=>{e.compute(ce(e.inputs[0],"Sinh","sinh"))},Bp=e=>{e.compute(ce(e.inputs[0],"Sqrt","sqrt"))},Dp=e=>{e.compute(ce(e.inputs[0],"Tan","tan"))},gn=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,Lp=e=>{e.compute(ce(e.inputs[0],"Tanh",gn))},ea=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${gn("v")};
}
`,ta=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,Up=e=>{let t=ke(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"FastGelu",ta,ea(t),void 0,e.inputs[0].dataType))},Wp=(e,t)=>{let r=ke(e.inputs[0].dataType);return e.compute(ce(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},qp=e=>{e.compute(ce(e.inputs[0],"Log","log"))},Ru=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,Mu=e=>`quick_gelu_impl(${e})`,Hp=(e,t)=>{let r=ke(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"QuickGelu",Mu,Ru(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),Au,Pu,Fp,s0=D(()=>{"use strict";ne(),ae(),Ta(),Au=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Pu=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=A("input",e[0].dataType,e[0].dims,4),i=A("bias",e[0].dataType,[e[0].dims[2]],4),n=V("output",e[0].dataType,t,4),a=z.size(t)/4,s=Se(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:o=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${o.declareVariables(r,i,n)}

  ${Qr(s)}

  ${o.mainStart()}
    ${o.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${n.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},Fp=e=>{Au(e.inputs),e.compute(Pu(e.inputs))}}),Nu,Bu,Ge,Vp,Gp,jp,Kp,Xp,Yp,Zp,Qp,Jp,eh,o0=D(()=>{"use strict";J(),ne(),ae(),Nu=(e,t,r,i,n,a,s,o,l,d,c,h)=>{let f,g;typeof o=="string"?f=g=(b,S)=>`${o}((${b}),(${S}))`:typeof o=="function"?f=g=o:(f=o.scalar,g=o.vector);let m=V("outputData",c,i.length,4),w=A("aData",l,t.length,4),v=A("bData",d,r.length,4),x;if(n)if(a){let b=z.size(t)===1,S=z.size(r)===1,T=t.length>0&&t[t.length-1]%4===0,I=r.length>0&&r[r.length-1]%4===0;b||S?x=m.setByOffset("global_idx",g(b?`${w.type.value}(${w.getByOffset("0")}.x)`:w.getByOffset("global_idx"),S?`${v.type.value}(${v.getByOffset("0")}.x)`:v.getByOffset("global_idx"))):x=`
            let outputIndices = ${m.offsetToIndices("global_idx * 4u")};
            let offsetA = ${w.broadcastedIndicesToOffset("outputIndices",m)};
            let offsetB = ${v.broadcastedIndicesToOffset("outputIndices",m)};
            ${m.setByOffset("global_idx",g(s||T?w.getByOffset("offsetA / 4u"):`${w.type.value}(${w.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||I?v.getByOffset("offsetB / 4u"):`${v.type.value}(${v.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else x=m.setByOffset("global_idx",g(w.getByOffset("global_idx"),v.getByOffset("global_idx")));else{if(!a)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let b=(S,T,I="")=>{let C=`aData[indexA${T}][componentA${T}]`,k=`bData[indexB${T}][componentB${T}]`;return`
            let outputIndices${T} = ${m.offsetToIndices(`global_idx * 4u + ${T}u`)};
            let offsetA${T} = ${w.broadcastedIndicesToOffset(`outputIndices${T}`,m)};
            let offsetB${T} = ${v.broadcastedIndicesToOffset(`outputIndices${T}`,m)};
            let indexA${T} = offsetA${T} / 4u;
            let indexB${T} = offsetB${T} / 4u;
            let componentA${T} = offsetA${T} % 4u;
            let componentB${T} = offsetB${T} % 4u;
            ${S}[${T}] = ${I}(${f(C,k)});
          `};c===9?x=`
            var data = vec4<u32>(0);
            ${b("data",0,"u32")}
            ${b("data",1,"u32")}
            ${b("data",2,"u32")}
            ${b("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:x=`
            ${b("outputData[global_idx]",0)}
            ${b("outputData[global_idx]",1)}
            ${b("outputData[global_idx]",2)}
            ${b("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(w,v,m)}

        ${h??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${x}
      }`},Bu=(e,t,r,i,n,a,s=r.dataType)=>{let o=r.dims.map(w=>Number(w)??1),l=i.dims.map(w=>Number(w)??1),d=!z.areEqual(o,l),c=o,h=z.size(o),f=!1,g=!1,m=[d];if(d){let w=qt.calcShape(o,l,!1);if(!w)throw new Error("Can't perform binary op on the given tensors");c=w.slice(),h=z.size(c);let v=z.size(o)===1,x=z.size(l)===1,b=o.length>0&&o[o.length-1]%4===0,S=l.length>0&&l[l.length-1]%4===0;m.push(v),m.push(x),m.push(b),m.push(S);let T=1;for(let I=1;I<c.length;I++){let C=o[o.length-I],k=l[l.length-I];if(C===k)T*=C;else break}T%4===0?(g=!0,f=!0):(v||x||b||S)&&(f=!0)}else f=!0;return m.push(f),{name:e,shaderCache:{hint:t+m.map(w=>w.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:w=>Nu(w,o,l,c,f,d,g,n,r.dataType,i.dataType,s,a),getRunData:()=>({outputs:[{dims:c,dataType:s}],dispatchGroup:{x:Math.ceil(h/64/4)},programUniforms:[{type:12,data:Math.ceil(z.size(c)/4)},...Y(o,l,c)]})}},Ge=(e,t,r,i,n,a)=>{e.compute(Bu(t,n??"",e.inputs[0],e.inputs[1],r,i,a))},Vp=e=>{Ge(e,"Add",(t,r)=>`${t}+${r}`)},Gp=e=>{Ge(e,"Div",(t,r)=>`${t}/${r}`)},jp=e=>{Ge(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},Kp=e=>{Ge(e,"Mul",(t,r)=>`${t}*${r}`)},Xp=e=>{let t=A("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;Ge(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},Yp=e=>{Ge(e,"Sub",(t,r)=>`${t}-${r}`)},Zp=e=>{Ge(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},Qp=e=>{Ge(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},Jp=e=>{Ge(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},eh=e=>{Ge(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),Du,Lu,Uu,Wu,th,rh,u0=D(()=>{"use strict";J(),ne(),_e(),ae(),Du=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],n=i.dataType,a=i.dims.length;e.forEach((s,o)=>{if(o!==r){if(s.dataType!==n)throw new Error("input tensors should be one type");if(s.dims.length!==a)throw new Error("input tensors should have the same shape");s.dims.forEach((l,d)=>{if(d!==t&&l!==i.dims[d])throw new Error("non concat dimensions must match")})}})},Lu=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,Uu=(e,t)=>{let r=e.length,i=[];for(let n=0;n<r;++n){let a=t.setByOffset("global_idx",e[n].getByIndices("indices"));r===1?i.push(a):n===0?i.push(`if (inputIndex == ${n}u) { ${a} }`):n===r-1?i.push(`else { ${a} }`):i.push(`else if (inputIndex == ${n}) { ${a} }`)}return i.join(`
`)},Wu=(e,t,r,i)=>{let n=z.size(r),a=new Array(e.length),s=new Array(e.length),o=0,l=[],d=[],c=[{type:12,data:n}];for(let w=0;w<e.length;++w)o+=e[w].dims[t],a[w]=o,d.push(e[w].dims.length),s[w]=A(`input${w}`,i,d[w]),l.push("rank"),c.push({type:12,data:a[w]});for(let w=0;w<e.length;++w)c.push(...Y(e[w].dims));c.push(...Y(r));let h=V("output",i,r.length),f=h.indicesGet("indices",t),g=Array.from(Array(a.length).keys()).map(w=>`uniforms.sizeInConcatAxis${w}`).join(","),m=w=>`

  ${(()=>{w.registerUniform("outputSize","u32");for(let v=0;v<e.length;v++)w.registerUniform(`sizeInConcatAxis${v}`,"u32");return w.declareVariables(...s,h)})()}

  ${Lu(a.length,g)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${h.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${f});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${a.length}u>(${g});
      ${f} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${Uu(s,h)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:c}),getShaderSource:m}},th=(e,t)=>{let r=e.inputs,i=r[0].dims,n=z.normalizeAxis(t.axis,i.length);Du(r,n);let a=i.slice();a[n]=r.reduce((o,l)=>o+(l.dims.length>n?l.dims[n]:0),0);let s=r.filter(o=>z.size(o.dims)>0);e.compute(Wu(s,n,a,r[0].dataType),{inputs:s})},rh=e=>pe({axis:e.axis})}),zt,Rt,Mt,Ia,Pt=D(()=>{"use strict";J(),ne(),zt=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Rt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Mt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Ia=e=>{let t=e?.activation||"";if(t==="HardSigmoid"){let[r,i]=e?.activation_params||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=e?.activation_params||[Ec,Cc];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=e?.activation_params||[.01];return{activation:t,alpha:r}}return{activation:t}}}),Te,ih,ka=D(()=>{"use strict";Te=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},ih=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),nh,l0=D(()=>{"use strict";nh=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),gr,Ea,Ca=D(()=>{"use strict";J(),ne(),ae(),Pt(),gr=(e,t,r,i,n)=>{let a=i-r;return`
      ${Array.from({length:r}).map((s,o)=>`
      if (${G(t.shape,o,t.rank)} != 1) {
        ${t.indicesSet(e,o,G(n,o+a,i))}
      } else {
        ${t.indicesSet(e,o,0)}
      }`).join("")}
`},Ea=(e,t,r,i,n=!1,a)=>{let s=e[0].dims,o=e[1].dims,l=s[s.length-2],d=o[o.length-1],c=s[s.length-1],h=we(d),f=we(c),g=we(l),m=z.size(r)/h/g,w=e.length>2,v=i?i.slice(0,-2):r.slice(0,-2),x=[z.size(v),l,d],b=[{type:12,data:m},{type:12,data:l},{type:12,data:d},{type:12,data:c}];Rt(t,b),b.push(...Y(v,s,o)),w&&b.push(...Y(e[2].dims)),b.push(...Y(x));let S=T=>{let I=$a("batch_dims",e[0].dataType,v.length),C=A("a",e[0].dataType,s.length,f),k=A("b",e[1].dataType,o.length,h),O=V("output",e[0].dataType,x.length,h),N=Se(O.type.tensor),L=zt(t,O.type.value,N),X=[C,k],F="";if(w){let re=n?h:1;X.push(A("bias",e[2].dataType,e[2].dims.length,re)),F=`${n?`value += bias[col / ${re}];`:`value += ${O.type.value}(bias[row + i]);`}`}let ee=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Mt(t,ee);let U=()=>{let re=`var a_data: ${C.type.value};`;for(let Z=0;Z<f;Z++)re+=`
              let b_data${Z} = b[(b_offset + (k + ${Z}) * uniforms.N + col) / ${h}];`;for(let Z=0;Z<g;Z++){re+=`a_data = a[(a_offset + (row + ${Z}) * uniforms.K + k) / ${f}];`;for(let H=0;H<f;H++)re+=`
            values[${Z}] = fma(${k.type.value}(a_data${f===1?"":`[${H}]`}), b_data${H}, values[${Z}]);
`}return re};return`
  ${T.registerUniforms(ee).registerInternalVariables(I).declareVariables(...X,O)}
  ${T.mainStart()}
    ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${h})) * ${h};
    var index1 = global_idx / (uniforms.N / ${h});
    let stride1 = uniforms.M / ${g};
    let row = (index1 % stride1) * ${g};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${I.offsetToIndices("batch")};`}

    var a_indices: ${C.type.indices};
    ${gr("a_indices",C,C.rank-2,I.rank,"batch_indices")}
    ${C.indicesSet("a_indices",C.rank-2,0)}
    ${C.indicesSet("a_indices",C.rank-1,0)}
    let a_offset = ${C.indicesToOffset("a_indices")};

    var b_indices: ${k.type.indices};
    ${gr("b_indices",k,k.rank-2,I.rank,"batch_indices")}
    ${k.indicesSet("b_indices",k.rank-2,0)}
    ${k.indicesSet("b_indices",k.rank-1,0)}
    let b_offset = ${k.indicesToOffset("b_indices")};
    var values: array<${O.type.value}, ${g}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${f}) {
      ${U()}
    }
    for (var i = 0u; i < ${g}u; i++) {
      var value = values[i];
      ${F}
      ${L}
      let cur_indices = ${O.type.indices}(batch, row + i, col);
      let offset = ${O.indicesToOffset("cur_indices")};
      ${O.setByOffset(`offset / ${h}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${h};${f};${g};${n}`,inputDependencies:w?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:b}),getShaderSource:S}}}),qu,Hu,ra,yn,Fu,ia,Vu,ii,Oa=D(()=>{"use strict";J(),ne(),ae(),Pt(),Ca(),ka(),qu=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,Hu=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,ra=(e,t,r="f32",i,n=!1,a=32,s=!1,o=32)=>{let l=t[1]*e[1],d=t[0]*e[0],c=n?l:a,h=n?a:l,f=c/t[0],g=a/t[1];if(!((n&&f===4&&e[1]===4||!n&&(f===3||f===4))&&c%t[0]===0&&a%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${n} is true, innerElementSize ${f} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${f} must be 3 or 4.
  tileAWidth ${c} must be divisible by workgroupSize[0]${t[0]}. tileInner ${a} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${f}<${r}>, ${c/f}>, ${h}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${d/e[0]}>, ${a}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${f};
const tileInner = ${a};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s?"0":"i32(globalId.z)"};
  ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${l};

  let num_tiles = ${s?`${Math.ceil(o/a)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${o}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${g};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${qu(n,i)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${i?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${f===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Hu(n,f)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},yn=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Fu=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",ia=(e,t,r="f32",i,n=!1,a=32,s=!1,o=32,l=!1)=>{let d=e[1]*t[1],c=e[0]*t[0],h=n?d:a,f=n?a:d;if(!(f%t[1]===0&&h%t[0]===0&&a%t[1]===0))throw new Error(`tileAHight ${f} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${h} must be divisible by workgroupSize[0]${t[0]}, tileInner ${a} must be divisible by workgroupSize[1]${t[1]}`);let g=f/t[1],m=h/t[0],w=a/t[1],v=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${d};
    let globalColStart = i32(workgroupId.x) * ${c};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${f}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${h}; inputCol = inputCol + ${t[0]}) {
          ${yn(n,i)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${a}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${c}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${i?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${n?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${d};

let tileRowA = i32(localId.y) * ${g};
let tileColA = i32(localId.x) * ${m};
let tileRowB = i32(localId.y) * ${w};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${m}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${yn(n,i)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${w}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${i?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Fu(n)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${h}>, ${f}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${c}>, ${a}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${a};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(o/a)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${o}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${v}
  }
`},Vu=(e,t,r,i,n=!1)=>{let[a,s,o,l]=i,d=Se(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${Te(e,d)} {
      var value = ${Te(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${gr("aIndices",s,s.rank-2,a.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${Te(e,d)} {
      var value = ${Te(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${o.type.indices};
        ${gr("bIndices",o,o.rank-2,a.rank,"batchIndices")}
        ${o.indicesSet("bIndices",o.rank-2,"u32(row)")}
        ${o.indicesSet("bIndices",o.rank-1,"u32(colIn)")}
        value = ${o.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Te(e,d)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${n?"bias[colIn]":`${Te(e,d)}(bias[row])`};`:""}
        ${r}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},ii=(e,t,r,i,n=!1,a)=>{let s=e[0].dims,o=e[1].dims,l=s.slice(0,-2),d=o.slice(0,-2),c=i?i.slice(0,-2):r.slice(0,-2),h=z.size(c),f=s[s.length-2],g=s[s.length-1],m=o[o.length-1],w=g%4===0&&m%4===0,v=f<=8?[4,1,1]:[4,4,1],x=[8,8,1],b=[Math.ceil(m/x[0]/v[0]),Math.ceil(f/x[1]/v[1]),Math.ceil(h/x[2]/v[2])],S=w?4:1,T=[...l,f,g/S],I=T.length,C=[...d,g,m/S],k=C.length,O=[h,f,m/S],N=[{type:6,data:f},{type:6,data:m},{type:6,data:g}];Rt(t,N),N.push(...Y(c,T,C));let L=["rank","rank"],X=e.length>2;X&&(N.push(...Y(e[2].dims)),L.push("rank")),N.push(...Y(O));let F=ee=>{let U=c.length,re=$a("batchDims",e[0].dataType,U,1),Z=Se(e[0].dataType),H=A("a",e[0].dataType,I,S),oe=A("b",e[1].dataType,k,S),j=V("result",e[0].dataType,O.length,S),ue=[H,oe];if(X){let ie=n?S:1;ue.push(A("bias",e[2].dataType,e[2].dims.length,ie))}let P=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Mt(t,P);let W=Se(j.type.tensor),te=zt(t,j.type.value,W),R=Vu(S,X,te,[re,H,oe,j],n);return`
  ${ee.registerUniforms(P).registerInternalVariables(re).declareVariables(...ue,j)}
  ${R}
  ${w?ra(v,x,Z,re):ia(v,x,Z,re)}
                   `};return{name:"MatMul",shaderCache:{hint:`${v};${t.activation};${w};${n}`,inputDependencies:L},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:b[0],y:b[1],z:b[2]},programUniforms:N}),getShaderSource:F}}}),Gu,ah,d0=D(()=>{"use strict";J(),st(),ae(),Pt(),ka(),l0(),Oa(),Gu=(e,t,r,i,n=!1,a,s=4,o=4,l=4,d="f32")=>{let c=N=>{switch(N){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${d}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${N} is not supported.`)}},h=N=>{switch(N){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${N} is not supported.`)}},f=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,g=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,m=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",w=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",v=e?"row":"col",x=e?"col":"row",b=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${v} / outWidth;
    let outCol = ${v} % outWidth;

    let WRow = ${x} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${x} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${x} % inChannels;
    var resData = ${Te(s,d)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${m} && xCol >= 0 && xCol < ${w}) {
      ${f}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${c(s)}
    }
    return resData;`,S=e?t&&i?`
    let col = colIn * ${s};
    ${b}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${b}
    }
    return ${Te(s,d)}(0.0);`:i&&r?`
    let col = colIn * ${s};
    ${b}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${b}
    }
    return ${Te(s,d)}(0.0);`,T=e?i&&r?h(o):`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${h(o)}
    }
    return ${Te(o,d)}(0.0);`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${h(o)}
    }
    return ${Te(o,d)}(0.0);`,I=Te(l,d),C=Te(e?s:o,d),k=Te(e?o:s,d),O=zt(a,I,d);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${C} {
      ${e?S:T}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${k} {
      ${e?T:S}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${I}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${g}
      ${ih(n)}
      ${O}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},ah=(e,t,r,i,n,a,s,o,l)=>{let d=t.format==="NHWC",c=d?e[0].dims[3]:e[0].dims[1],h=r[0],f=d?r[2]:r[3],g=d?r[1]:r[2],m=d?r[3]:r[1],w=d&&(c%4===0||c%3===0)&&m%4===0,v=d?m:f*g,x=d?f*g:m,b=[8,8,1],S=i<=8?[4,1,1]:[4,4,1],T=[Math.ceil(v/b[0]/S[0]),Math.ceil(x/b[1]/S[1]),Math.ceil(h/b[2]/S[2])];le("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${T}`);let I=w?d&&c%4!==0?3:4:1,C=b[1]*S[1],k=b[0]*S[0],O=Math.max(b[0]*I,b[1]),N=i%C===0,L=n%k===0,X=a%O===0,F=w?[I,4,4]:[1,1,1],ee=[{type:6,data:i},{type:6,data:n},{type:6,data:a},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Rt(t,ee),ee.push(...Y(e[0].dims,e[1].dims));let U=["rank","rank"];s&&(ee.push(...Y(e[2].dims)),U.push("rank")),ee.push(...Y(r));let re=Z=>{let H=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Mt(t,H);let oe=w?4:1,j=Se(e[0].dataType),ue=`
      fn setOutputAtIndex(flatIndex : i32, value : ${w?`vec4<${j}>`:j}) {
        result[flatIndex] = ${w?`vec4<${j}>`:j}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${w?`vec4<${j}>`:j}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${w?"/ 4":""}, value);
      }`,P=A("x",e[0].dataType,e[0].dims.length,I===3?1:I),W=A("w",e[1].dataType,e[1].dims.length,oe),te=[P,W],R=V("result",e[0].dataType,r.length,oe);if(s){let ie=A("bias",e[2].dataType,e[2].dims.length,oe);te.push(ie),ue+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${w?`vec4<${j}>`:j} {
          return bias[coords.${d?"w":"y"}${w?"/ 4":""}];
        }`}return`
        ${nh("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${Z.registerUniforms(H).declareVariables(...te,R)}
        ${ue}
        ${Gu(d,N,L,X,s,t,F[0],F[1],F[2],j)}
        ${w?ra(S,b,j,void 0,!d,O):ia(S,b,j,void 0,!d,O,!1,void 0,o)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${I};${w};${N};${L};${X};${C};${k};${O}`,inputDependencies:U},getRunData:()=>({outputs:[{dims:l?l(r):r,dataType:e[0].dataType}],dispatchGroup:{x:T[0],y:T[1],z:T[2]},programUniforms:ee}),getShaderSource:re}}}),ju,bn,sr,Ku,wn,Xu,sh,oh,c0=D(()=>{"use strict";J(),st(),ne(),ae(),Pt(),ka(),ju=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},bn=e=>typeof e=="number"?[e,e,e]:e,sr=(e,t)=>t<=1?e:e+(e-1)*(t-1),Ku=(e,t,r,i=1)=>{let n=sr(t,i);return Math.floor((e[0]*(r-1)-r+n)/2)},wn=(e,t,r,i,n)=>{n==null&&(n=Ku(e,t[0],i[0]));let a=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*n>=t[s]&&(a[s]=Math.trunc((e[s]-t[s]+2*n)/i[s]+1));return a},Xu=(e,t,r,i,n,a,s,o,l,d)=>{let c,h,f,g;if(e==="VALID"&&(e=0),typeof e=="number"){c={top:e,bottom:e,left:e,right:e,front:e,back:e};let m=wn([t,r,i,1],[o,l,d],1,[n,a,s],e);h=m[0],f=m[1],g=m[2]}else if(Array.isArray(e)){if(!e.every((w,v,x)=>w===x[0]))throw Error(`Unsupported padding parameter: ${e}`);c={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let m=wn([t,r,i,1],[o,l,d],1,[n,a,s],e[0]);h=m[0],f=m[1],g=m[2]}else if(e==="SAME_UPPER"){h=Math.ceil(t/n),f=Math.ceil(r/a),g=Math.ceil(i/s);let m=(h-1)*n+o-t,w=(f-1)*a+l-r,v=(g-1)*s+d-i,x=Math.floor(m/2),b=m-x,S=Math.floor(w/2),T=w-S,I=Math.floor(v/2),C=v-I;c={top:S,bottom:T,left:I,right:C,front:x,back:b}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:c,outDepth:h,outHeight:f,outWidth:g}},sh=(e,t,r,i,n,a=!1,s="channelsLast")=>{let o,l,d,c,h;if(s==="channelsLast")[o,l,d,c,h]=e;else if(s==="channelsFirst")[o,h,l,d,c]=e;else throw new Error(`Unknown dataFormat ${s}`);let[f,,g,m,w]=t,[v,x,b]=bn(r),[S,T,I]=bn(i),C=sr(g,S),k=sr(m,T),O=sr(w,I),{padInfo:N,outDepth:L,outHeight:X,outWidth:F}=Xu(n,l,d,c,v,x,b,C,k,O),ee=a?f*h:f,U=[0,0,0,0,0];return s==="channelsFirst"?U=[o,ee,L,X,F]:s==="channelsLast"&&(U=[o,L,X,F,ee]),{batchSize:o,dataFormat:s,inDepth:l,inHeight:d,inWidth:c,inChannels:h,outDepth:L,outHeight:X,outWidth:F,outChannels:ee,padInfo:N,strideDepth:v,strideHeight:x,strideWidth:b,filterDepth:g,filterHeight:m,filterWidth:w,effectiveFilterDepth:C,effectiveFilterHeight:k,effectiveFilterWidth:O,dilationDepth:S,dilationHeight:T,dilationWidth:I,inShape:e,outShape:U,filterShape:t}},oh=(e,t,r,i,n,a)=>{let s=a==="channelsLast",o=s?e[0].dims[3]:e[0].dims[1],l=!1,d=[64,1,1],c={x:r.map((b,S)=>S)},h=[Math.ceil(ju(c.x.map(b=>r[b]))/d[0]),1,1];le("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${h}`);let f=l?s&&o%4!==0?3:4:1,g=z.size(r),m=[{type:12,data:g},{type:12,data:i},{type:12,data:n},{type:12,data:t.strides},{type:12,data:t.dilations}];Rt(t,m),m.push(...Y(e[0].dims,e[1].dims));let w=["rank","rank"],v=e.length===3;v&&(m.push(...Y(e[2].dims)),w.push("rank")),m.push(...Y(r));let x=b=>{let S=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:n.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Mt(t,S);let T=l?4:1,I=Se(e[0].dataType),C=A("x",e[0].dataType,e[0].dims.length,f===3?1:f),k=A("W",e[1].dataType,e[1].dims.length,T),O=[C,k],N=V("result",e[0].dataType,r.length,T),L="";if(v){let ee=A("bias",e[2].dataType,e[2].dims.length,T);O.push(ee),L+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${l?`vec4<${I}>`:I} {
          return bias[${s?G("coords",4,5):G("coords",1,5)}${l?"/ 4":""}];
        }`}let X=Te(f,I),F=zt(t,X,I);return`
            ${L}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${C.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${k.getByIndices("aIndices")};
            }
          ${b.registerUniforms(S).declareVariables(...O,N)}
          ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${N.offsetToIndices("global_idx")};
              let batch = ${G("coords",0,C.rank)};
              let d2 = ${s?G("coords",C.rank-1,C.rank):G("coords",1,C.rank)};
              let xFRCCorner = vec3<u32>(${s?G("coords",1,C.rank):G("coords",2,C.rank)},
              ${s?G("coords",2,C.rank):G("coords",3,C.rank)},
              ${s?G("coords",3,C.rank):G("coords",4,C.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?G("uniforms.x_shape",1,C.rank):G("uniforms.x_shape",2,C.rank)};
              let xShapeZ = ${s?G("uniforms.x_shape",2,C.rank):G("uniforms.x_shape",3,C.rank)};
              let xShapeW = ${s?G("uniforms.x_shape",3,C.rank):G("uniforms.x_shape",4,C.rank)};
              let xShapeU = ${s?G("uniforms.x_shape",4,C.rank):G("uniforms.x_shape",1,C.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${s?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${v?"value = value + getBiasByOutputCoords(coords)":""};
              ${F}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${f};${v}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:h[0],y:h[1],z:h[2]},programUniforms:m}),getShaderSource:x}}}),uh,lh,p0=D(()=>{"use strict";J(),ne(),ae(),Pt(),uh=(e,t,r,i)=>{let n=e.length>2,a=n?"value += b[output_channel];":"",s=e[0].dims,o=e[1].dims,l=t.format==="NHWC",d=l?r[3]:r[1],c=d/t.group,h=l&&c>=4?we(d):1,f=z.size(r)/h,g=[{type:12,data:f},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:c}];Rt(t,g),g.push(...Y(s,[o[0],o[1],o[2],o[3]/h]));let m=n?["rank","rank","rank"]:["rank","rank"];g.push(...Y([r[0],r[1],r[2],r[3]/h]));let w=v=>{let x=V("output",e[0].dataType,r.length,h),b=Se(x.type.tensor),S=zt(t,x.type.value,b),T=A("x",e[0].dataType,s.length),I=A("w",e[1].dataType,o.length,h),C=[T,I];n&&C.push(A("b",e[2].dataType,e[2].dims,h));let k=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Mt(t,k);let O=l?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${T.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${I.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${T.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${I.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${v.registerUniforms(k).declareVariables(...C,x)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${x.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${h} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${x.type.value} = ${x.type.value}(0);
    ${O}
    ${a}
    ${S}
    ${x.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${h}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:g}),getShaderSource:w}},lh=(e,t,r,i)=>{let n=e.length>2,a=we(r[3]),s=we(r[2]),o=z.size(r)/a/s,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/a],d=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/a],c=[r[0],r[1],r[2],r[3]/a],h=[{type:12,data:o},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Rt(t,h),h.push(...Y(l,d,c));let f=(s-1)*t.strides[1]+d[1],g=m=>{let w=V("output",e[0].dataType,c.length,a),v=Se(w.type.tensor),x=zt(t,w.type.value,v),b=A("x",e[0].dataType,l.length,a),S=A("w",e[1].dataType,d.length,a),T=[b,S];n&&T.push(A("b",e[2].dataType,e[2].dims,a));let I=n?"value += b[output_channel];":"",C=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Mt(t,C),`
  ${m.registerUniforms(C).declareVariables(...T,w)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${b.type.value}, ${f}>;
    var values: array<${w.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${d[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${f}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${b.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${b.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${d[1]}; w_width++) {
          let w_val = ${S.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${I}
      ${x}
      ${w.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${a};${s};${f};${d[0]};${d[1]}`,inputDependencies:n?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:h}),getShaderSource:g}}}),Yu,Vr,Zu,Gr,na,_n,Qu,Ju,aa,h0=D(()=>{"use strict";ne(),d0(),c0(),Oa(),p0(),Pt(),Ca(),yt(),Yu=(e,t,r,i,n,a)=>{let s=e[0],o=e.slice(a?1:2,a?3:4),l=o.length,d=t[0],c=t.slice(2).map((f,g)=>f+(f-1)*(r[g]-1)),h=o.map((f,g)=>f+i[g]+i[g+l]).map((f,g)=>Math.floor((f-c[g]+n[g])/n[g]));return h.splice(0,0,s),h.splice(a?3:1,0,d),h},Vr=[2,3,1,0],Zu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Gr=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let a=2;a<t[1].dims.length;++a)r[a-2]===0&&(r[a-2]=t[1].dims[a]);let i=e.pads.slice();ti.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let n=Object.assign({},e);return Object.assign(n,{kernelShape:r,pads:i}),n},na=e=>{let t=Ia(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],n=e.dilations,a=e.group,s=e.kernel_shape,o=e.pads,l=e.strides,d=e.w_is_const();return{autoPad:i,format:r,dilations:n,group:a,kernelShape:s,pads:o,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},_n=(e,t,r,i)=>{let n=r.format==="NHWC",a=Yu(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,n);if(r.group!==1){let C=[t[0]];if(n){let k=e.kernelCustomData.wT??e.compute(Pe(t[1],Vr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=k),C.push(k)}else C.push(t[1]);t.length===3&&C.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&n&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(lh(C,r,a,i),{inputs:C}):e.compute(uh(C,r,a,i),{inputs:C});return}let s=t.length===3,o=t[0].dims[n?1:2],l=t[0].dims[n?2:3],d=t[0].dims[n?3:1],c=t[1].dims[2],h=t[1].dims[3],f=a[n?1:2],g=a[n?2:3],m=a[n?3:1],w=n&&c===o&&h===l&&r.pads[0]===0&&r.pads[1]===0;if(w||c===1&&h===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let C=a[0],k,O,N,L=[];if(n){let ee=e.kernelCustomData.wT??e.compute(Pe(t[1],Vr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=ee),w){let U=o*l*d;k=t[0].reshape([1,C,U]),O=ee.reshape([1,U,m]),N=[1,C,m]}else k=t[0].reshape([C,o*l,d]),O=ee.reshape([1,d,m]),N=[C,f*g,m];L.push(k),L.push(O)}else k=t[0].reshape([C,d,o*l]),O=t[1].reshape([1,m,d]),N=[C,m,f*g],L.push(O),L.push(k);s&&L.push(t[2]);let X=N[2],F=L[0].dims[L[0].dims.length-1];X<8&&F<8?e.compute(Ea(L,r,a,N,n,i),{inputs:L}):e.compute(ii(L,r,a,N,n,i),{inputs:L});return}let v=!0,x=e.kernelCustomData.wT??e.compute(Pe(t[1],Vr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=x);let b=[t[0],x];s&&b.push(t[2]);let S=n?f*g:m,T=n?m:f*g,I=c*h*d;e.compute(ah(b,r,a,S,T,I,s,v,i),{inputs:b})},Qu=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=[0,t.pads[0],0,t.pads[1]],a=[1].concat(t.strides),s=[1].concat(t.dilations),o=[1].concat(t.kernelShape),l=Gr({...t,pads:n,strides:a,dilations:s,kernelShape:o},i);_n(e,i,l,d=>r?[d[0],d[2],d[3]]:[d[0],d[1],d[3]])},Ju=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",n=Gr(r,t),a=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=sh(t[0].dims,t[1].dims,r.strides,r.dilations,a,!1,i);e.compute(oh(t,n,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],i))},aa=(e,t)=>{if(Zu(e.inputs,t),e.inputs[0].dims.length===3)Qu(e,t);else if(e.inputs[0].dims.length===5)Ju(e,e.inputs,t);else{let r=Gr(t,e.inputs);_n(e,e.inputs,r)}}}),dh,f0=D(()=>{"use strict";J(),st(),ne(),ae(),dh=(e,t,r)=>{let i=e.length>2,n=t.outputShape,a=t.format==="NHWC",s=t.group,o=e[1].dims,l=o[2]/s,d=o[3],c=a?we(l):1,h=a&&d===1&&l>=4,f=h?Math.floor(l/4)*4:Math.floor(l/c)*c,g=l-f,m=a?we(d):1,w=a?d===1?c:m:1,v=z.size(n)/m,x=[Math.ceil(v/64),1,1];le("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${x}`);let b=["rank","rank"],S=[t.strides[0],t.strides[1]],T=[t.kernelShape[a?1:2],t.kernelShape[a?2:3]],I=[t.dilations[0],t.dilations[1]],C=[T[0]+(t.dilations[0]<=1?0:(t.kernelShape[a?1:2]-1)*(t.dilations[0]-1)),T[1]+(t.dilations[1]<=1?0:(t.kernelShape[a?2:3]-1)*(t.dilations[1]-1))],k=[C[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),C[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],O=[{type:12,data:v},{type:12,data:S},{type:12,data:T},{type:12,data:I},{type:12,data:C},{type:6,data:k},{type:12,data:f},{type:12,data:l},{type:12,data:d},...Y(e[0].dims,e[1].dims)];i&&(O.push(...Y(e[2].dims)),b.push("rank")),O.push(...Y(n));let N=L=>{let X=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:S.length},{name:"filter_dims",type:"u32",length:T.length},{name:"dilations",type:"u32",length:T.length},{name:"effective_filter_dims",type:"u32",length:C.length},{name:"pads",type:"i32",length:k.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],F=Se(e[0].dataType),ee=a?1:2,U=a?2:3,re=a?3:1,Z=A("W",e[1].dataType,e[1].dims.length,w),H=A("Dy",e[0].dataType,e[0].dims.length,c),oe=[H,Z];i&&oe.push(A("bias",e[2].dataType,[n[re]].length,m));let j=V("result",e[0].dataType,n.length,m),ue=()=>{let te="";if(h)c===4?te+=`
        let xValue = ${H.getByOffset("x_offset")};
        let wValue = ${Z.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:c===2?te+=`
          dotProd = dotProd + dot(vec4<${F}>(${H.getByOffset("x_offset")}, ${H.getByOffset("x_offset + 1u")}), vec4<${F}>(${Z.getByOffset("w_offset")}, ${Z.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:c===1&&(te+=`
          dotProd = dotProd + dot(vec4<${F}>(${H.getByOffset("x_offset")}, ${H.getByOffset("x_offset + 1u")}, ${H.getByOffset("x_offset + 2u")}, ${H.getByOffset("x_offset + 3u")}), vec4<${F}>(${Z.getByOffset("w_offset")}, ${Z.getByOffset("w_offset + 1u")}, ${Z.getByOffset("w_offset + 2u")}, ${Z.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(te+=`
                  let xValue = ${a?H.getByOffset(`${H.indicesToOffset(`${H.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c}`):H.get("batch","inputChannel","idyR","idyC")};
        `,c===1)te+=`
          let w_offset = ${Z.indicesToOffset(`${Z.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${Z.getByOffset(`w_offset / ${w}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let R=0;R<c;R++)te+=`
            let wValue${R} = ${Z.getByOffset(`${Z.indicesToOffset(`${Z.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${R}, wOutChannel)`)} / ${w}`)};
            dotProd = dotProd + xValue[${R}] * wValue${R};`;return te},P=()=>{if(g===0)return"";if(!h)throw new Error(`packInputAs4 ${h} is not true.`);let te="";if(c===1){te+="dotProd = dotProd";for(let R=0;R<g;R++)te+=`
            + ${H.getByOffset(`x_offset + ${R}`)} * ${Z.getByOffset(`w_offset + ${R}`)}`;te+=";"}else if(c===2){if(g!==2)throw new Error(`Invalid inputChannelsRemainder ${g}.`);te+=`
          let xValue = ${H.getByOffset("x_offset")};
          let wValue = ${Z.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return te},W=`
            let outputIndices = ${j.offsetToIndices(`global_idx * ${m}`)};
            let batch = ${j.indicesGet("outputIndices",0)};
            let d1 = ${j.indicesGet("outputIndices",re)};
            let r = ${j.indicesGet("outputIndices",ee)};
            let c = ${j.indicesGet("outputIndices",U)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${j.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${F}(dyRCorner) + ${F}(wR)) / ${F}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${F}(uniforms.Dy_shape[${ee}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${F}(dyCCorner) + ${F}(wC)) / ${F}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${F}(uniforms.Dy_shape[${U}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${h?`
                var x_offset = ${H.indicesToOffset(`${H.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c};
                var w_offset = ${Z.indicesToOffset(`${Z.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${w};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${h?4:c}) {
                  ${ue()}
                  inputChannel = inputChannel + ${h?4:c};
                }
                ${P()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${m}]`:""};
            ${j.setByOffset("global_idx","value")};
          `;return`
    ${L.registerUniforms(X).declareVariables(...oe,j)}
      ${L.mainStart()}
      ${L.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${W}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${c}${w}${m}${h}${g}`,inputDependencies:b},getRunData:()=>({dispatchGroup:{x:x[0],y:x[1],z:x[2]},outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],programUniforms:O}),getShaderSource:N}}}),el,tl,rl,xn,ch,il,$n,nl,ph,m0=D(()=>{"use strict";f0(),Pt(),yt(),el=(e,t,r,i,n,a)=>(e-1)*t+r+(i-1)*n+1-a,tl=(e,t,r,i,n)=>{let a=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=a,r[n]=e-a):t==="SAME_LOWER"&&(r[i]=e-a,r[n]=a)},rl=(e,t,r,i,n,a,s,o,l,d)=>{let c=e.length-2,h=d.length===0;l.length<c&&l.push(...Array(c-l.length).fill(0));let f=e[0],g=t[o?3:1]*n;for(let m=0,w=e.length-c-(o?1:0);m<c;++m,++w){let v=e[w],x=h?v*s[m]:d[m],b=el(v,s[m],a[m],t[w],r[m],x);tl(b,i,a,m,m+c),h&&d.push(s[m]*(v-1)+l[m]+(t[w]-1)*r[m]+1-a[m]-a[m+c])}d.splice(0,0,f),d.splice(o?3:1,0,g)},xn=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((h,f)=>h*f,1)===0){r.length=0;for(let h=2;h<t[1].dims.length;++h)r.push(t[1].dims[h])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let n=e.pads.slice(),a=e.outputShape.slice(),s=e.outputPadding.slice(),o=t[0].dims,l=e.dilations.slice();if(l.reduce((h,f)=>h+f,0)===0){let h=t[0].dims.length-2;l=new Array(h).fill(1)}let d=e.strides.slice();if(d.reduce((h,f)=>h+f,0)===0){let h=t[0].dims.length-2;d=new Array(h).fill(1)}rl(o,r,l,e.autoPad,e.group,n,d,i,s,a);let c=Object.assign({},e);return Object.assign(c,{kernelShape:r,pads:n,outputPadding:s,outputShape:a,dilations:l,strides:d}),c},ch=e=>{let t=Ia(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],n=e.dilations,a=e.group,s=e.kernelShape,o=e.pads,l=e.strides,d=e.wIsConst(),c=e.outputPadding,h=e.outputShape;return{autoPad:i,format:r,dilations:n,group:a,kernelShape:s,outputPadding:c,outputShape:h,pads:o,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},il=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let n=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==n))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.reduce((s,o)=>s+o,0)>0&&t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.reduce((s,o)=>s+o,0)>0&&t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.reduce((s,o)=>s+o,0)>0&&t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.outputPadding.length!==a&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${a}D`);if(t.kernelShape.reduce((s,o)=>s+o,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},$n=(e,t,r,i)=>{let n=e.kernelCustomData.wT??e.compute(Pe(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=n);let a=[t[0],n];t.length===3&&a.push(t[2]),e.compute(dh(a,r,i),{inputs:a})},nl=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=t.kernelShape;(n.length===0||n[0]===0)&&(n=[e.inputs[1].dims[2]]);let a=t.dilations;(a.length===0||a[0]===0)&&(a=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let o=t.pads;o.length===0&&(o=[0,0]),o=[0,o[0],0,o[1]],s=[1].concat(s),a=[1].concat(a),n=[1].concat(n);let l=t.outputPadding;l=[0].concat(l);let d=xn({...t,pads:o,strides:s,dilations:a,kernelShape:n,outputPadding:l},i);$n(e,i,d,c=>r?[c[0],c[2],c[3]]:[c[0],c[1],c[3]])},ph=(e,t)=>{if(il(e.inputs,t),e.inputs[0].dims.length===3)nl(e,t);else{let r=xn(t,e.inputs);$n(e,e.inputs,r)}}}),al,hh,fh,g0=D(()=>{"use strict";J(),ne(),_e(),ae(),al=(e,t,r,i)=>{let n=z.size(t),a=t.length,s=A("input",e,a),o=V("output",e,a),l=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),d=z.normalizeAxis(l,a),c=h=>{let f=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,g=G("uniforms.input_shape","uniforms.axis",a),m=i.reverse?f+(i.exclusive?" + 1":""):"0",w=i.reverse?g:f+(i.exclusive?"":" + 1");return`
                ${h.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,o)}
                ${h.mainStart()}
                  ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${o.offsetToIndices("global_idx")};
                  var sum = ${o.type.value}(0);
                  let first : i32 = ${m};
                  let last : i32 = ${w};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${o.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},{type:12,data:d},...Y(t,t)]}),getShaderSource:c}},hh=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,n=e.inputs[1];e.compute(al(i,r,n,t),{inputs:[0]})},fh=e=>{let t=e.exclusive===1,r=e.reverse===1;return pe({exclusive:t,reverse:r})}}),sl,ol,ul,mh,gh,y0=D(()=>{"use strict";J(),ne(),_e(),ae(),sl=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},ol=(e,t,r,i)=>{let n=[];n.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let a=0;a<t;++a)n.push(r.indicesSet("a",e[a],`i[${a}]`));return n.push("return a;}"),n.join(`
`)},ul=(e,t)=>{let r,i,n,a,s,o,l=t.format==="NHWC",d=t.blocksize,c=t.mode==="DCR";l?([r,i,n,a]=e.dims,s=c?[r,i,n,d,d,a/d**2]:[r,i,n,a/d**2,d,d],o=c?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,n,a]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=c?[r,d,d,a/d**2,i,n]:[r,a/d**2,d,d,i,n],o=c?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let h=e.reshape(s),f=h.dims.length,g=e.dataType,m=A("a",g,f),w=V("output",g,f),v=x=>`
  ${x.registerUniform("output_size","u32").declareVariables(m,w)}

  ${ol(o,f,m,w)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${w.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${w.setByOffset("global_idx",m.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:x=>{let b=l?[r,i*d,n*d,a/d**2]:[r,a/d**2,i*d,n*d],S=z.size(b),T=h.dims,I=z.sortBasedOnPerm(T,o);return{outputs:[{dims:b,dataType:x[0].dataType}],dispatchGroup:{x:Math.ceil(S/64)},programUniforms:[{type:12,data:S},...Y(T,I)]}},getShaderSource:v}},mh=(e,t)=>{sl(e.inputs),e.compute(ul(e.inputs[0],t))},gh=e=>pe({blocksize:e.blocksize,mode:e.mode,format:e.format})}),jr,or,vn,ll,dl,cl,pl,Sn,hl,yh,bh,b0=D(()=>{"use strict";J(),ne(),_e(),ae(),jr="[a-zA-Z]|\\.\\.\\.",or="("+jr+")+",vn="^"+or+"$",ll="("+or+",)*"+or,dl="^"+ll+"$",cl=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},pl=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(dl)))throw new Error("Invalid LHS term");if(r.split(",").forEach((n,a)=>{let s=e[a].dims.slice();if(!n.match(RegExp(vn)))throw new Error("Invalid LHS term");let o=this.processTerm(n,!0,s,a);this.lhs.push(o)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([n,a])=>a.count===1||n==="...").map(([n])=>n).join("");else if(!i.match(RegExp(or)))throw new Error("Invalid RHS");i.match(RegExp(jr,"g"))?.forEach(n=>{if(n==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let a=this.symbolToInfo.get(n);if(a===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(a.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let n=r.length,a=!1,s=[],o=0;if(!e.match(RegExp(vn))&&!t&&e!=="")throw new Error("Invalid LHS term");let l=e.match(RegExp(jr,"g")),d=new cl(i);return l?.forEach((c,h)=>{if(c==="..."){if(a)throw new Error("Only one ellipsis is allowed per input term");a=!0;let f=n-l.length+1;if(f<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(o,o+f),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let g=0;g<s.length;g++){let m=String.fromCharCode(48+g);d.addSymbol(m,h+g),this.addSymbol(m,r[o++],i)}}else d.addSymbol(c,h+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(c,r[o++],i)}),d}},Sn=e=>e+"_max",hl=(e,t,r,i)=>{let n=e.map(d=>d.length).map((d,c)=>A(`input${c}`,t,d)),a=z.size(i),s=V("output",t,i.length),o=[...r.symbolToInfo.keys()].filter(d=>!r.rhs.symbolToIndices.has(d)),l=d=>{let c=[],h="var prod = 1.0;",f="var sum = 0.0;",g="sum += prod;",m=[],w=[],v=[],x=[],b=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((T,I)=>{if(r.rhs.symbolToIndices.has(I)){let C=r.rhs.symbolToIndices.get(I)?.[0];C!==void 0&&r.lhs.forEach((k,O)=>{if(T.inputIndices.includes(O)){let N=k.symbolToIndices.get(I);if(N===void 0)throw new Error("Invalid symbol error");N.forEach(L=>{c.push(`${n[O].indicesSet(`input${O}Indices`,L,s.indicesGet("outputIndices",C))}`)})}})}else r.lhs.forEach((C,k)=>{if(T.inputIndices.includes(k)){let O=C.symbolToIndices.get(I);if(O===void 0)throw new Error("Invalid symbol error");O.forEach(N=>{m.push(`${n[k].indicesSet(`input${k}Indices`,N,`${I}`)}`)}),x.push(`prod *= ${n[k].getByIndices(`input${k}Indices`)};`)}}),w.push(`for(var ${I}: u32 = 0; ${I} < uniforms.${Sn(I)}; ${I}++) {`),v.push("}")});let S=b?[...c,`let sum = ${n.map((T,I)=>T.getByIndices(`input${I}Indices`)).join(" * ")};`]:[...c,f,...w,...m,h,...x,g,...v];return`
            ${d.registerUniforms(o.map(T=>({name:`${Sn(T)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...n,s)}

            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${n.map((T,I)=>`var input${I}Indices: ${n[I].type.indices};`).join(`
`)}
            ${S.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let d=o.filter(h=>r.symbolToInfo.has(h)).map(h=>({type:12,data:r.symbolToInfo.get(h)?.dimValue||0}));d.push({type:12,data:a});let c=e.map((h,f)=>[...Y(h)]).reduce((h,f)=>h.concat(f),d);return c.push(...Y(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:c}},getShaderSource:l}},yh=(e,t)=>{let r=new pl(e.inputs,t.equation),i=r.outputDims,n=e.inputs.map((a,s)=>a.dims);e.compute(hl(n,e.inputs[0].dataType,r,i))},bh=e=>{let t=e.equation.replace(/\s+/g,"");return pe({equation:t})}}),fl,Tn,ml,gl,wh,w0=D(()=>{"use strict";J(),ne(),ae(),fl=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,n=t.length<r.length?0:t.length-r.length;for(;i<r.length&&n<t.length;++i,++n)if(r[i]!==t[n]&&r[i]!==1&&t[n]!==1)throw new Error("Expand requires shape to be broadcastable to input")},Tn=(e,t)=>{let r=e.length-t.length,i=[];for(let n=0;n<r;++n)i.push(e[n]);for(let n=0;n<t.length;++n)i.push(t[n]===1?e[n+r]:t[n]);return i},ml=(e,t)=>e.length>t.length?Tn(e,t):Tn(t,e),gl=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=ml(t,r),n=e[0].dataType,a=n===9||z.size(t)===1,s=n===9||t.length>0&&t[t.length-1]%4===0?4:1,o=a||i.length>0&&i[i.length-1]%4===0?4:1,l=Math.ceil(z.size(i)/o),d=h=>{let f=A("input",n,t.length,s),g=V("output",n,i.length,o),m;if(n===9){let w=(v,x,b="")=>`
          let outputIndices${x} = ${g.offsetToIndices(`outputOffset + ${x}u`)};
          let offset${x} = ${f.broadcastedIndicesToOffset(`outputIndices${x}`,g)};
          let index${x} = offset${x} / 4u;
          let component${x} = offset${x} % 4u;
          ${v}[${x}] = ${b}(${f.getByOffset(`index${x}`)}[component${x}]);
        `;m=`
        let outputOffset = global_idx * ${o};
        var data = vec4<u32>(0);
        ${w("data",0,"u32")}
        ${w("data",1,"u32")}
        ${w("data",2,"u32")}
        ${w("data",3,"u32")}
        ${g.setByOffset("global_idx","data")}
      }`}else m=`
        let outputIndices = ${g.offsetToIndices(`global_idx * ${o}`)};
        let inputOffset = ${f.broadcastedIndicesToOffset("outputIndices",g)};
        let data = ${g.type.value}(${f.getByOffset(`inputOffset / ${s}`)});
        ${g.setByOffset("global_idx","data")}
      }`;return`
    ${h.registerUniform("vec_size","u32").declareVariables(f,g)}
    ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${m}`},c=[{type:12,data:l},...Y(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${s}${o}`,inputDependencies:["rank"]},getShaderSource:d,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c})}},wh=e=>{fl(e.inputs),e.compute(gl(e.inputs),{inputs:[0]})}}),yl,_h,_0=D(()=>{"use strict";J(),ne(),ae(),Ta(),yl=e=>{let t=e[0].dataType,r=z.size(e[0].dims),i=z.size(e[1].dims),n=i%4===0,a=s=>{let o=A("x",t,[1],4),l=A("bias",t,[1],4),d=V("y",t,[1],4),c=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],h=g=>`
      let bias${g}_offset: u32 = (global_idx * 4 + ${g}) % uniforms.bias_size;
      let bias${g} = ${l.getByOffset(`bias${g}_offset / 4`)}[bias${g}_offset % 4];`,f=n?`
      let bias = ${l.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${h(0)}${h(1)}${h(2)}${h(3)}
      let bias = ${o.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(c).declareVariables(o,l,d)}

    ${ea(ke(t))}

    ${s.mainStart(Ht)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${o.getByOffset("global_idx")};
      ${f}
      let x_in = x + bias;
      ${d.setByOffset("global_idx",ta("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${n}`,inputDependencies:["type","type"]},getShaderSource:a,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/Ht/4)}})}},_h=e=>{e.inputs.length<2||z.size(e.inputs[1].dims)===0?Up(e):e.compute(yl(e.inputs))}}),bl,wl,xh,$h,x0=D(()=>{"use strict";J(),ne(),_e(),ae(),bl=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},wl=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,a=z.normalizeAxis(t.axis,n),s=r.slice(0);s.splice(a,1,...i);let o=r[a],l=e[0].dataType===9?4:1,d=Math.ceil(z.size(s)/l),c=[{type:12,data:d},{type:6,data:o},{type:12,data:a},...Y(e[0].dims,e[1].dims,s)],h=f=>{let g=A("data",e[0].dataType,e[0].dims.length,l),m=A("inputIndices",e[1].dataType,e[1].dims.length),w=V("output",e[0].dataType,s.length,l),v=b=>{let S=i.length,T=`var indicesIndices${b}  = ${m.type.indices}(0);`;for(let I=0;I<S;I++)T+=`${S>1?`indicesIndices${b}[${I}]`:`indicesIndices${b}`} = ${s.length>1?`outputIndices${b}[uniforms.axis + ${I}]`:`outputIndices${b}`};`;T+=`
          var idx${b} = ${m.getByIndices(`indicesIndices${b}`)};
          if (idx${b} < 0) {
            idx${b} = idx${b} + uniforms.axisDimLimit;
          }
          var dataIndices${b} : ${g.type.indices};
        `;for(let I=0,C=0;I<n;I++)I===a?(T+=`${n>1?`dataIndices${b}[${I}]`:`dataIndices${b}`} = u32(idx${b});`,C+=S):(T+=`${n>1?`dataIndices${b}[${I}]`:`dataIndices${b}`} = ${s.length>1?`outputIndices${b}[${C}]`:`outputIndices${b}`};`,C++);return T},x;if(e[0].dataType===9){let b=(S,T,I="")=>`
          let outputIndices${T} = ${w.offsetToIndices(`outputOffset + ${T}u`)};
          ${v(T)};
          let offset${T} = ${g.indicesToOffset(`dataIndices${T}`)};
          let index${T} = offset${T} / 4u;
          let component${T} = offset${T} % 4u;
          ${S}[${T}] = ${I}(${g.getByOffset(`index${T}`)}[component${T}]);
        `;x=`
        let outputOffset = global_idx * ${l};
        var value = vec4<u32>(0);
        ${b("value",0,"u32")}
        ${b("value",1,"u32")}
        ${b("value",2,"u32")}
        ${b("value",3,"u32")}
        ${w.setByOffset("global_idx","value")}
      `}else x=`
      let outputIndices = ${w.offsetToIndices("global_idx")};
      ${v("")};
      let value = ${g.getByIndices("dataIndices")};
      ${w.setByOffset("global_idx","value")};
      `;return`
      ${f.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(g,m,w)}
      ${f.mainStart()}
        ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${x}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c}),getShaderSource:h}},xh=e=>pe({axis:e.axis}),$h=(e,t)=>{let r=e.inputs;bl(r),e.compute(wl(e.inputs,t))}}),_l,vh,Sh,$0=D(()=>{"use strict";J(),ne(),ae(),_l=(e,t,r,i,n,a,s,o,l)=>{let d=[{type:12,data:a},{type:12,data:i},{type:12,data:n},{type:12,data:r},{type:12,data:s},{type:12,data:o},{type:12,data:l}],c=[a];d.push(...Y(t.dims,c));let h=f=>{let g=A("indices_data",t.dataType,t.dims.length),m=V("input_slice_offsets_data",12,1,1),w=[g,m],v=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:n.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${f.registerUniforms(v).declareVariables(...w)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${n.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${n.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:c,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:d}),getShaderSource:h},{inputs:[t],outputs:[-1]})[0]},vh=(e,t)=>{let r=e.inputs,i=r[0].dims,n=r[0].dataType,a=r[1].dims,s=a[a.length-1],o=z.sizeToDimension(a,a.length-1),l=z.sizeFromDimension(i,t.batchDims+s),d=z.sizeToDimension(i,t.batchDims),c=z.sizeFromDimension(i,t.batchDims),h=o/d,f=new Array(s),g=l;for(let T=0;T<s;++T)f[s-1-T]=g,g*=i[t.batchDims+s-1-T];let m=_l(e,r[1],f,t.batchDims,i,o,h,c,s),w=t.batchDims+s;if(w>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let v=a.slice(0,-1).concat(i.slice(w)),x=z.size(v),b=[{type:12,data:x},{type:12,data:l},...Y(r[0].dims,m.dims,v)],S=T=>{let I=A("data",r[0].dataType,r[0].dims.length),C=A("slice_offsets",12,m.dims.length),k=V("output",r[0].dataType,v.length);return`
          ${T.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(I,C,k)}
            ${T.mainStart()}
            ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:v,dataType:n}],dispatchGroup:{x:Math.ceil(x/64)},programUniforms:b}),getShaderSource:S},{inputs:[r[0],m]})},Sh=e=>({batchDims:e.batch_dims,cacheKey:""})}),xl,$l,Th,Ih,v0=D(()=>{"use strict";J(),ne(),_e(),ae(),xl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=z.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,n=e[0],a=e[2],s=e.length===4?e[3]:void 0;if(a.dims.length!==n.dims.length||!n.dims.map((o,l)=>l===r?Math.ceil(o/i)===a.dims[l]:o===a.dims[l]).reduce((o,l)=>o&&l,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==n.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==a.dims.length||!s.dims.map((o,l)=>o===a.dims[l]).reduce((o,l)=>o&&l,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},$l=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,a=z.normalizeAxis(t.gatherAxis,n),s=z.normalizeAxis(t.quantizeAxis,n),o=r.slice(0);o.splice(a,1,...i);let l=z.size(o),d=e[2].dataType,c=e[0].dataType===22,h=[{type:12,data:l},{type:12,data:s},{type:12,data:a},{type:12,data:t.blockSize},...Y(...e.map((g,m)=>g.dims),o)],f=g=>{let m=A("data",e[0].dataType,e[0].dims.length),w=A("inputIndices",e[1].dataType,e[1].dims.length),v=A("scales",e[2].dataType,e[2].dims.length),x=e.length>3?A("zeroPoint",e[3].dataType,e[3].dims.length):void 0,b=V("output",d,o.length),S=[m,w,v];x&&S.push(x);let T=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${g.registerUniforms(T).declareVariables(...S,b)}
        ${g.mainStart()}
        let output_indices = ${b.offsetToIndices("global_idx")};
        var indices_indices = ${w.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${b.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${w.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${b.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${m.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${b.indicesGet("output_indices","i")};
          ${m.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${w.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[a]};
        }
        ${m.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${o.length}; i++) {
          let index = ${b.indicesGet("output_indices",`i + ${i.length} - 1`)};
          ${m.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${m.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${m.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${v.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${v.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${v.getByIndices("scale_indices")};
        ${x?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${x.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${x.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${ke(d)}(quantized_data - zero_point) * scale;
        ${b.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((g,m)=>m!==1).map(g=>g.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(g,m)=>"rank")},getRunData:()=>({outputs:[{dims:o,dataType:d}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:h}),getShaderSource:f}},Th=(e,t)=>{let r=e.inputs;xl(r,t),e.compute($l(e.inputs,t))},Ih=e=>pe({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),vl,Sl,kh,Eh,S0=D(()=>{"use strict";J(),ne(),_e(),ae(),vl=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Sl=(e,t)=>{let r=e[0].dims,i=e[0].dataType,n=r.length,a=e[1].dims,s=e[1].dataType,o=z.normalizeAxis(t.axis,n),l=r[o],d=a.slice(0),c=z.size(d),h=A("input",i,n),f=A("indicesInput",s,a.length),g=V("output",i,d.length),m=[{type:12,data:c},{type:6,data:l},{type:12,data:o}];return m.push(...Y(r,a,d)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:d,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:m}),getShaderSource:w=>`
      ${w.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(h,f,g)}
      ${w.mainStart()}
      ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${g.offsetToIndices("global_idx")};

      var idx = ${f.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${h.type.indices}(outputIndices);
      ${h.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${h.getByIndices("inputIndices")};

      ${g.setByOffset("global_idx","value")};
  }`}},kh=e=>pe({axis:e.axis}),Eh=(e,t)=>{let r=e.inputs;vl(r),e.compute(Sl(e.inputs,t))}}),Tl,Il,Ch,Oh,T0=D(()=>{"use strict";J(),ne(),ae(),Tl=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Il=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[n,a,s]=kc.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),o=[n,a];if(!o)throw new Error("Can't use gemm on the given tensors");let l=16,d=Math.ceil(a/l),c=Math.ceil(n/l),h=!0,f=z.size(o),g=[{type:12,data:h?d:f},{type:12,data:n},{type:12,data:a},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],m=["type","type"];e.length===3&&(g.push(...Y(e[2].dims)),m.push("rank")),g.push(...Y(o));let w=x=>{let b="";t.transA&&t.transB?b="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?b="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?b="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(b="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let S=t.alpha===1?"":"value *= uniforms.alpha;",T=A("a",e[0].dataType,e[0].dims),I=A("b",e[1].dataType,e[1].dims),C=T.type.value,k=null,O=[T,I];e.length===3&&(k=A("c",e[2].dataType,e[2].dims.length),O.push(k));let N=V("output",e[0].dataType,o.length);O.push(N);let L=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${x.registerUniforms(L).declareVariables(...O)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${C}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${b}
    }

    ${S}
    ${k!=null?`let cOffset = ${k.broadcastedIndicesToOffset("vec2(m, n)",N)}; value += ${C}(uniforms.beta) * ${k.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},v=x=>{let b=A("a",e[0].dataType,e[0].dims),S=A("b",e[1].dataType,e[1].dims),T=null,I=[b,S];e.length===3&&(T=A("c",e[2].dataType,e[2].dims.length),I.push(T));let C=V("output",e[0].dataType,o.length);I.push(C);let k=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],O="",N="";t.transA&&t.transB?(N=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,O="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(N=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,O="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(N=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,O="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(N=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,O="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let L=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${x.registerUniforms(k).declareVariables(...I)}
  var<workgroup> tile_a: array<array<${b.type.storage}, ${l}>, ${l}>;
  var<workgroup> tile_b: array<array<${S.type.storage}, ${l}>, ${l}>;
  ${x.mainStart([l,l,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${l};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${l};
    let num_tiles = (uniforms.K - 1) / ${l} + 1;
    var k_start = 0u;
    var value = ${C.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${N}
      k_start = k_start + ${l};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${l}; k++) {
        ${O}
      }
      workgroupBarrier();
    }

    ${L}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${T!=null?`let cOffset = ${T.broadcastedIndicesToOffset("vec2(m, n)",C)}; value += ${C.type.value}(uniforms.beta) * ${T.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return h?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:d*c},programUniforms:g}),getShaderSource:v}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:g}),getShaderSource:w}},Ch=e=>{let t=e.transA,r=e.transB,i=e.alpha,n=e.beta;return{transA:t,transB:r,alpha:i,beta:n,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},Oh=(e,t)=>{Tl(e.inputs),e.compute(Il(e.inputs,t))}}),tt,nt,vt,St,kl,El,Cl,Ol,zl,Rl,Ml,Al,zh,Rh,I0=D(()=>{"use strict";J(),ne(),_e(),ae(),[tt,nt,vt,St]=[0,1,2,3],kl=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},El=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,Cl=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Ol=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,zl=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,Rl=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${tt}] = batch;
     indices[${nt}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${vt}] = u32(r);
            indices[${St}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${vt}] = u32(clamp(r, 0, H - 1));
          indices[${St}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${vt}] = gs_reflect(r, border[1], border[3]);
          indices[${St}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,Ml=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${tt}], indices[${nt}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${tt}], indices[${nt}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${tt}], indices[${nt}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${tt}], indices[${nt}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${tt}], indices[${nt}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${tt}], indices[${nt}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,Al=(e,t)=>{let r=A("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],n=A("grid",e[1].dataType,i.length,2),a=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(a=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[tt,nt,vt,St]=[0,3,1,2]);let s=V("output",e[0].dataType,a.length),o=r.type.value,l=z.size(a),d=[{type:12,data:l},...Y(e[0].dims,i,a)],c=h=>`
  ${h.registerUniform("output_size","u32").declareVariables(r,n,s)}
  ${El}
  ${Cl(o)}
  ${Ol(t)}
  ${zl(t)}
  ${Rl(r,o,t)}

  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${vt}]);
      let W_in = i32(uniforms.x_shape[${St}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${s.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${tt}], indices[${vt}], indices[${St}]);
      let nxy = ${n.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${Ml(s,o,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:h=>{let f=z.size(a);return{outputs:[{dims:a,dataType:h[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:d}},getShaderSource:c}},zh=(e,t)=>{kl(e.inputs),e.compute(Al(e.inputs,t))},Rh=e=>pe({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Oe,Pl,Mh,In,Nl,mr,Ah,Ph=D(()=>{"use strict";J(),ne(),_e(),xa(),Sa(),ae(),yt(),Oe=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Pl=(e,t)=>{let r=e[0],i=Oe(e,1),n=Oe(e,2),a=Oe(e,3),s=Oe(e,4),o=Oe(e,5),l=Oe(e,6),d=Oe(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let c=r.dims[0],h=r.dims[1],f=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],g=h,m=0,w=0,v=Math.floor(f/t.numHeads);if(l&&d&&z.size(l.dims)&&z.size(d.dims)){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(l.dims[0]!==c||l.dims[1]!==t.numHeads||l.dims[3]!==v)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[0]!==c||d.dims[1]!==t.numHeads||d.dims[3]!==v)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[2]!==d.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(d.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');m=l.dims[2],w=l.dims[2]}else if(l&&z.size(l.dims)||d&&z.size(d.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let x;if(i&&z.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');x=2,g=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==v)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');x=5,g=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==v)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');x=0,g=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');x=3}if(a&&z.size(a.dims)>0){if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let b=m+g,S=0;if(s&&z.size(s.dims)>0){S=8;let k=s.dims;throw k.length===1?k[0]===c?S=1:k[0]===3*c+2&&(S=3):k.length===2&&k[0]===c&&k[1]===b&&(S=5),S===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let T=!1,I=f;if(n&&z.size(n.dims)>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(g!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');I=n.dims[2]}else{if(g!==n.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');I=n.dims[1]*n.dims[3],T=!0}}let C=!1;if(s&&z.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(o&&z.size(o.dims)>0){if(o.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(o.dims[0]!==c||o.dims[1]!==t.numHeads||o.dims[2]!==h||o.dims[3]!==b)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:c,sequenceLength:h,pastSequenceLength:m,kvSequenceLength:g,totalSequenceLength:b,maxSequenceLength:w,inputHiddenSize:0,hiddenSize:f,vHiddenSize:I,headSize:v,vHeadSize:Math.floor(I/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:S,scale:t.scale,broadcastResPosBias:C,passPastInKv:T,qkvFormat:x}},Mh=e=>pe({...e}),In=pe({perm:[0,2,1,3]}),Nl=(e,t,r,i,n,a,s)=>{let o=[i,n,a],l=z.size(o),d=[{type:12,data:l},{type:12,data:s},{type:12,data:a}],c=h=>{let f=V("qkv_with_bias",t.dataType,o),g=A("qkv",t.dataType,o),m=A("bias",r.dataType,o),w=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${h.registerUniforms(w).declareVariables(g,m,f)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:o,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:c},{inputs:[t,r],outputs:[-1]})[0]},mr=(e,t,r,i,n,a,s,o)=>{let l=a;if(s&&z.size(s.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return l=Nl(e,a,s,t,i,r*n,o),l=l.reshape([t,i,r,n]),r===1||i===1?l:e.compute(Pe(l,In.perm),{inputs:[l],outputs:[-1]})[0]}else return a.dims.length===3&&(l=a.reshape([t,i,r,n])),r===1||i===1?l:e.compute(Pe(l,In.perm),{inputs:[l],outputs:[-1]})[0]},Ah=(e,t)=>{let r=Pl(e.inputs,t),i=e.inputs[0],n=Oe(e.inputs,1),a=Oe(e.inputs,2),s=Oe(e.inputs,3),o=Oe(e.inputs,4),l=Oe(e.inputs,5),d=Oe(e.inputs,6),c=Oe(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if(n?.dims.length===5)throw new Error("Packed KV is not implemented");let h=n&&a&&n.dims.length===4&&a.dims.length===4,f=mr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,s,0);if(h)return wr(e,f,n,a,o,void 0,d,c,l,r);if(!n||!a)throw new Error("key and value must be provided");let g=mr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,n,s,r.hiddenSize),m=mr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,a,s,2*r.hiddenSize);wr(e,f,g,m,o,void 0,d,c,l,r)}}),Bl,Dl,Ll,Ul,sa,Nh,Bh,Dh=D(()=>{"use strict";J(),ne(),_e(),ae(),Bl=e=>{if(!e||e.length<1)throw new Error("too few inputs")},Dl=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(n=>r.push(Number(n))),i=r.length),pe({numOutputs:i,axis:t.axis,splitSizes:r})},Ll=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${G("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,Ul=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let n=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(n):i===0?r.push(`if (output_number == ${i}u) { ${n} }`):i===t-1?r.push(`else { ${n} }`):r.push(`else if (output_number == ${i}) { ${n} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},sa=(e,t)=>{let r=e[0].dims,i=z.size(r),n=e[0].dataType,a=z.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),o=A("input",n,r.length),l=new Array(t.numOutputs),d=[],c=[],h=0,f=[{type:12,data:i}];for(let m=0;m<t.numOutputs;m++){h+=t.splitSizes[m],l[m]=h;let w=r.slice();w[a]=t.splitSizes[m],c.push(w),s[m]=V(`output${m}`,n,w.length),d.push({dims:c[m],dataType:e[0].dataType})}f.push({type:12,data:l},...Y(r,...c));let g=m=>`
  ${m.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(o,...s)}
  ${Ll(l.length)}
  ${Ul(s)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${o.offsetToIndices("global_idx")};
    var index = ${o.indicesGet("indices",a)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${G("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${o.indicesSet("indices",a,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:g,getRunData:()=>({outputs:d,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:f})}},Nh=(e,t)=>{Bl(e.inputs);let r=e.inputs.length===1?t:Dl(e.inputs,t);e.compute(sa(e.inputs,r),{inputs:[0]})},Bh=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes lengh must be equal");return pe({axis:t,numOutputs:i,splitSizes:r})}}),Wl,ni,Lh,Uh=D(()=>{"use strict";J(),ne(),_e(),ae(),Wl=(e,t)=>{let[r,i,n,a]=e,{numHeads:s,rotaryEmbeddingDim:o}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!z.areEqual(i.dims,[])&&!z.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(!z.areEqual(n.dims,a.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(o>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let l=r.dims[0],d=r.dims[r.dims.length-2],c=n.dims[0],h=z.sizeFromDimension(r.dims,1)/d,f=o===0?n.dims[1]*2:h/s;if(o>f)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(l!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(d!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(f/2!==n.dims[1]&&o/2!==n.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${n.dims[1]}`);if(d>c)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},ni=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:n,scale:a}=t,s=e[0].dims[0],o=z.sizeFromDimension(e[0].dims,1),l=e[0].dims[e[0].dims.length-2],d=o/l,c=e[2].dims[1],h=n===0?c*2:d/i,f=new Array(s,l,d/h,h-c),g=z.computeStrides(f),m=[{type:1,data:a},{type:12,data:f},{type:12,data:g},...e[0].dims.length===3?new Array({type:12,data:[o,d,h,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[o,h,l*h,1]}):[],...Y(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],w=v=>{let x=A("input",e[0].dataType,e[0].dims.length),b=A("position_ids",e[1].dataType,e[1].dims.length),S=A("cos_cache",e[2].dataType,e[2].dims.length),T=A("sin_cache",e[3].dataType,e[3].dims.length),I=V("output",e[0].dataType,e[0].dims.length);return v.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:f.length},{name:"global_strides",type:"u32",length:g.length},{name:"input_output_strides",type:"u32",length:g.length}]),`
        ${v.declareVariables(x,b,S,T,I)}

        ${v.mainStart(Ht)}
          let half_rotary_emb_dim = uniforms.${S.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${v.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${b.broadcastedIndicesToOffset("bsnh.xy",V("",b.type.tensor,2))};
            let position_id =
                u32(${b.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${x.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} -
                ${x.getByOffset("j")} * ${T.get("position_id","bsnh[3]")};
            ${I.setByOffset("i","re")}
            let im = ${x.getByOffset("i")} * ${T.get("position_id","bsnh[3]")} +
                ${x.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${I.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${I.setByOffset("k",x.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:pe({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(z.size(f)/Ht)},programUniforms:m})}},Lh=(e,t)=>{Wl(e.inputs,t),e.compute(ni(e.inputs,t))}}),ql,Hl,kn,Fl,Wh,k0=D(()=>{"use strict";_e(),J(),Sa(),Ph(),Dh(),yt(),Uh(),ae(),ql=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],n=e[2],a=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let o=!1,l=r.dims[0],d=r.dims[1],c=r.dims.length===3?o?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],h=d,f=0,g=!i||i.dims.length===0,m=Math.floor(g?c/(t.numHeads+2*t.kvNumHeads):c/t.numHeads);g&&(c=m*t.numHeads);let w=a&&a.dims.length!==0,v=s&&s.dims.length!==0;if(w&&a.dims.length===4&&a.dims[0]===l&&a.dims[1]!==t.kvNumHeads&&a.dims[2]===t.kvNumHeads&&a.dims[3]===m)throw new Error("BSNH pastKey/pastValue is not supported");if(w&&v){if(a.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');f=a.dims[2]}else if(w||v)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let x=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');h=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==m)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');h=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==m)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');h=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');x=3}let b=0,S=!1,T=t.kvNumHeads?m*t.kvNumHeads:c;if(n&&n.dims.length>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(h!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');T=n.dims[2]}else{if(h!==n.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');T=n.dims[1]*n.dims[3],S=!0}}let I=e.length>4?e[5]:void 0;if(I&&I.dims.length!==1&&I.dims[0]!==l)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:l,sequenceLength:d,pastSequenceLength:f,kvSequenceLength:h,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:c,vHiddenSize:T,headSize:m,vHeadSize:Math.floor(T/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:S,qkvFormat:x}},Hl=pe({perm:[0,2,1,3]}),kn=(e,t,r)=>{let i=t,n=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,n,r.headSize]),i=e.compute(Pe(i,Hl.perm),{inputs:[i],outputs:[-1]})[0]),i},Fl=(e,t,r,i)=>{let n=7,a=["type","type"],s=[e*t],o=e*t,l=[{type:12,data:o},{type:12,data:t},{type:12,data:e}],d=c=>{let h=A("seq_lens",r.dataType,r.dims),f=A("total_seq_lens",i.dataType,i.dims),g=V("pos_ids",n,s),m=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${c.registerUniforms(m).declareVariables(h,f,g)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${f.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${h.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${g.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${g.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${g.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:a},getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:l}),getShaderSource:d}},Wh=(e,t)=>{let r=ql(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],n=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,a=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,o=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,l=e.inputs.length>4?e.inputs[5]:void 0,d=e.inputs.length>5?e.inputs[6]:void 0,c=r.kvNumHeads?r.kvNumHeads:r.numHeads,h=pe({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,c*r.headSize,c*r.headSize]}),[f,g,m]=!n&&!a?e.compute(sa([i],h),{inputs:[i],outputs:[-1,-1,-1]}):[i,n,a],w,v;if(t.doRotary){let T=e.compute(Fl(r.batchSize,r.sequenceLength,l,d),{inputs:[l,d],outputs:[-1]})[0],I=e.inputs[7],C=e.inputs[8],k=pe({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),O=[f,T,I,C],N=[-1];w=e.compute(ni(O,k),{inputs:O,outputs:N})[0],O.splice(0,1,g);let L=pe({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});v=e.compute(ni(O,L),{inputs:O,outputs:N})[0]}let x=mr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?w:f,void 0,0),b=kn(e,t.doRotary?v:g,r),S=kn(e,m,r);wr(e,x,b,S,void 0,void 0,s,o,void 0,r,l,d)}}),En,Vl,Gl,qh,E0=D(()=>{"use strict";J(),ne(),yt(),ae(),En=(e,t,r,i,n,a,s,o)=>{let l=we(a),d=l===1?"f32":`vec${l}f`,c=l===1?"vec2f":`mat2x${l}f`,h=n*s,f=64;h===1&&(f=256);let g=[n,s,a/l],m=[n,s,2],w=["rank","type","type"],v=[];v.push(...Y(g,m));let x=b=>{let S=A("x",t.dataType,3,l),T=A("scale",r.dataType,r.dims),I=A("bias",i.dataType,i.dims),C=V("output",1,3,2),k=[S,T,I,C];return`
  var<workgroup> workgroup_shared : array<${c}, ${f}>;
  const workgroup_size = ${f}u;
  ${b.declareVariables(...k)}
  ${b.mainStart(f)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${d}(0);
    var squared_sum = ${d}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${d}(${S.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${c}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${gt("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${gt("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${o}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${o};${f}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:m,dataType:1}],dispatchGroup:{x:h},programUniforms:v}),getShaderSource:x},{inputs:[t,r,i],outputs:[-1]})[0]},Vl=(e,t,r)=>{let i=t[0].dims,n=i,a=2,s=i[0],o=i[1],l=z.sizeFromDimension(i,a),d=we(l),c=z.size(n)/d,h=En(e,t[0],t[1],t[2],s,l,o,r.epsilon),f=[s,o,l/d],g=[s,o],m=["type","none"],w=v=>{let x=A("x",t[0].dataType,f.length,d),b=A("scale_shift",1,g.length,2),S=V("output",t[0].dataType,f.length,d),T=[x,b,S];return`
  ${v.registerUniform("output_size","u32").declareVariables(...T)}
  ${v.mainStart()}
  ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${S.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${b.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${x.getByOffset("global_idx")} * ${S.type.value}(scale_shift.x) + ${S.type.value}(scale_shift.y);
      ${S.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${d}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:[{type:12,data:c},...Y(f,g,f)]}),getShaderSource:w},{inputs:[t[0],h]})},Gl=(e,t,r)=>{let i=t[0].dims,n=i,a=i[0],s=i[i.length-1],o=z.sizeFromDimension(i,1)/s,l=we(s),d=z.size(n)/l,c=[{type:12,data:o},{type:12,data:Math.floor(s/l)}],h=["type","type"],f=!1,g=[0,i.length-1];for(let x=0;x<i.length-2;x++)f=f||i[x+1]!==1,g.push(x+1);f=f&&i[i.length-1]!==1;let m=f?e.compute(Pe(e.inputs[0],g),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},(x,b)=>i[g[b]])),w=En(e,m,t[1],t[2],a,o,s,r.epsilon),v=x=>{let b=Se(t[0].dataType),S=l===1?"vec2f":`mat${l}x2f`,T=k=>{let O=k===0?"x":"y",N=l===1?"f32":`vec${l}f`;switch(l){case 1:return`${b}(${N}(scale.${O}))`;case 2:return`vec2<${b}>(${N}(scale[0].${O}, scale[1].${O}))`;case 4:return`vec4<${b}>(${N}(scale[0].${O}, scale[1].${O}, scale[2].${O}, scale[3].${O}))`;default:throw new Error(`Not supported compoents ${l}`)}},I=A("input",t[0].dataType,t[0].dims,l),C=V("output",t[0].dataType,n,l);return`
  @group(0) @binding(0) var<storage, read> input : array<${I.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${S}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${C.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${x.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${T(0)}, ${T(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${l}`,inputDependencies:h},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c}),getShaderSource:v},{inputs:[t[0],w]})},qh=(e,t)=>{t.format==="NHWC"?Gl(e,e.inputs,t):Vl(e,e.inputs,t)}}),jl,Kl,Hh,C0=D(()=>{"use strict";J(),ne(),ae(),jl=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},Kl=(e,t,r)=>{let i=t.simplified,n=e[0].dims,a=e[1],s=!i&&e[2],o=n,l=z.normalizeAxis(t.axis,n.length),d=z.sizeToDimension(n,l),c=z.sizeFromDimension(n,l),h=z.size(a.dims),f=s?z.size(s.dims):0;if(h!==c||s&&f!==c)throw new Error(`Size of X.shape()[axis:] == ${c}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${h} and bias size of ${f}`);let g=[];for(let I=0;I<n.length;++I)I<l?g.push(n[I]):g.push(1);let m=we(c),w=["type","type"],v=[{type:12,data:d},{type:1,data:c},{type:12,data:Math.floor(c/m)},{type:1,data:t.epsilon}];s&&w.push("type");let x=r>1,b=r>2,S=I=>{let C=Se(e[0].dataType),k=[A("x",e[0].dataType,e[0].dims,m),A("scale",a.dataType,a.dims,m)];s&&k.push(A("bias",s.dataType,s.dims,m)),k.push(V("output",e[0].dataType,o,m)),x&&k.push(V("mean_data_output",1,g)),b&&k.push(V("inv_std_output",1,g));let O=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${I.registerUniforms(O).declareVariables(...k)}
  ${I.mainStart()}
    ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Zn("f32",m)};
    var mean_square_vector = ${Zn("f32",m)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Wt(C,m,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${gt("mean_vector",m)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${gt("mean_square_vector",m)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Wt(C,m,"x[j + offset]")};
      let f32scale = ${Wt(C,m,"scale[j]")};
      output[j + offset] = ${k[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${Wt(C,m,"bias[j]")}`:""}
      );
    }

    ${x?"mean_data_output[global_idx] = mean":""};
    ${b?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},T=[{dims:o,dataType:e[0].dataType}];return x&&T.push({dims:g,dataType:1}),b&&T.push({dims:g,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${m};${r};${i}`,inputDependencies:w},getRunData:()=>({outputs:T,dispatchGroup:{x:Math.ceil(d/64)},programUniforms:v}),getShaderSource:S}},Hh=(e,t)=>{jl(e.inputs),e.compute(Kl(e.inputs,t,e.outputCount))}}),Xl,Fh,O0=D(()=>{"use strict";ne(),Ca(),Oa(),Xl=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Fh=e=>{Xl(e.inputs);let t=qt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(Ea(e.inputs,{activation:""},t));else{let n=t[t.length-2],a=z.size(e.inputs[0].dims.slice(0,-2)),s=z.size(e.inputs[1].dims.slice(0,-2));if(a!==1&&n===1&&s===1){let o=e.inputs[0].reshape([1,a,i]),l=e.inputs[1].reshape([1,i,r]),d=[1,a,r],c=[o,l];e.compute(ii(c,{activation:""},t,d),{inputs:c})}else e.compute(ii(e.inputs,{activation:""},t))}}}),Yl,Zl,Ql,Vh,Gh,z0=D(()=>{"use strict";J(),ne(),_e(),ae(),Yl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let n=Math.floor((t.k+t.blockSize-1)/t.blockSize),a=t.blockSize/8*t.bits,s=e[1];if(!z.areEqual(s.dims,[t.n,n,a]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let o=e[2].dims;if(z.size(o)!==t.n*n)throw new Error("scales input size error.");if(e.length===4){let l=e[3].dims,d=t.bits>4?t.n*n:t.n*Math.floor((n+1)/2);if(z.size(l)!==d)throw new Error("zeroPoints input size error.")}},Zl=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],a=t.k,s=t.n,o=r.slice(0,i-2),l=z.size(o),d=e[1].dims[2]/4,c=e[0].dataType,h=we(t.k),f=we(d),g=we(s),m=o.concat([n,s]),w=n>1&&s/g%2===0?2:1,v=z.size(m)/g/w,x=64,b=[],S=[l,n,a/h],T=z.convertShape(e[1].dims).slice();T.splice(-1,1,d/f),b.push(...Y(S)),b.push(...Y(T)),b.push(...Y(e[2].dims)),e.length===4&&b.push(...Y(z.convertShape(e[3].dims)));let I=[l,n,s/g];b.push(...Y(I));let C=k=>{let O=S.length,N=A("a",e[0].dataType,O,h),L=A("b",12,T.length,f),X=A("scales",e[2].dataType,e[2].dims.length),F=[N,L,X],ee=e.length===4?A("zero_points",12,e[3].dims.length):void 0;ee&&F.push(ee);let U=I.length,re=V("output",e[0].dataType,U,g),Z=Se(e[0].dataType),H=(()=>{switch(h){case 1:return`array<${Z}, 8>`;case 2:return`mat4x2<${Z}>`;case 4:return`mat2x4<${Z}>`;default:throw new Error(`${h}-component is not supported.`)}})(),oe=()=>{let P=`
          // reuse a data
            var input_offset = ${N.indicesToOffset(`${N.type.indices}(batch, row, word_offset)`)};
            var a_data: ${H};
            for (var j: u32 = 0; j < ${8/h}; j++) {
              a_data[j] = ${N.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let W=0;W<g*w;W++)P+=`
            b_value = ${f===1?`b${W}_data`:`b${W}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${H}(${Array.from({length:4},(te,R)=>`${Z}(b_value_lower[${R}]), ${Z}(b_value_upper[${R}])`).join(", ")});
            b_dequantized_values = ${h===1?`${H}(${Array.from({length:8},(te,R)=>`(b_quantized_values[${R}] - ${ee?`zero_point${W}`:"zero_point"}) * scale${W}`).join(", ")});`:`(b_quantized_values - ${H}(${Array(8).fill(`${ee?`zero_point${W}`:"zero_point"}`).join(",")})) * scale${W};`};
            workgroup_shared[local_id.x * ${w} + ${Math.floor(W/g)}]${g>1?`[${W%g}]`:""} += ${Array.from({length:8/h},(te,R)=>`${h===1?`a_data[${R}] * b_dequantized_values[${R}]`:`dot(a_data[${R}], b_dequantized_values[${R}])`}`).join(" + ")};
          `;return P},j=()=>{let P=`
            var col_index = col * ${g};
            ${ee?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${Z}(8);`}
            `;for(let W=0;W<g*w;W++)P+=`
            let scale${W} = ${X.getByOffset("col_index * nBlocksPerCol + block")};
            ${ee?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${ee.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${W} = ${Z}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return P},ue=()=>{let P=`col_index = col * ${g};`;for(let W=0;W<g*w;W++)P+=`
            let b${W}_data = ${L.getByIndices(`${L.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return P+=`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${H};
            var b_dequantized_values: ${H};`,P};return`
        var<workgroup> workgroup_shared: array<${re.type.value}, ${w*x}>;
        ${k.declareVariables(...F,re)}
        ${k.mainStart([x,1,1])}
          let output_indices = ${re.offsetToIndices(`(global_idx / ${x}) * ${w}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${x}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/h};
            ${j()}
            for (var word: u32 = 0; word < ${d}; word += ${f}) {
              ${ue()}
              for (var i: u32 = 0; i < ${f}; i++) {
                ${oe()}
                word_offset += ${8/h};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${w}) {
            var output_value: ${re.type.value} = ${re.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${x}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${w};
            }
            ${re.setByIndices(`${re.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${h};${f};${g};${w};${x}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:m,dataType:c}],dispatchGroup:{x:v},programUniforms:b}),getShaderSource:C}},Ql=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],a=t.k,s=t.n,o=r.slice(0,i-2),l=z.size(o),d=e[1].dims[2]/4,c=e[0].dataType,h=we(t.k),f=we(d),g=o.concat([n,s]),m=128,w=s%8===0?8:s%4===0?4:1,v=m/w,x=v*f*8,b=x/h,S=x/t.blockSize,T=z.size(g)/w,I=[],C=[l,n,a/h],k=z.convertShape(e[1].dims).slice();k.splice(-1,1,d/f),I.push(...Y(C)),I.push(...Y(k)),I.push(...Y(e[2].dims)),e.length===4&&I.push(...Y(z.convertShape(e[3].dims)));let O=[l,n,s];I.push(...Y(O));let N=L=>{let X=C.length,F=A("a",e[0].dataType,X,h),ee=A("b",12,k.length,f),U=A("scales",e[2].dataType,e[2].dims.length),re=[F,ee,U],Z=e.length===4?A("zero_points",12,e[3].dims.length):void 0;Z&&re.push(Z);let H=O.length,oe=V("output",e[0].dataType,H),j=Se(e[0].dataType),ue=()=>{switch(h){case 1:return`
          let a_data0 = vec4<${j}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${j}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${j}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${j}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${h}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${F.type.value}, ${b}>;
        var<workgroup> inter_results: array<array<${oe.type.value}, ${v}>, ${w}>;
        ${L.declareVariables(...re,oe)}
        ${L.mainStart([v,w,1])}
          let output_indices = ${oe.offsetToIndices(`workgroup_index * ${w}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${S} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${b};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${b}; a_offset += ${m})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${F.getByIndices(`${F.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${F.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${S} + local_id.x;
            ${Z?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${Z.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${j}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${j}(8);`}
            let scale = ${U.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${ee.getByIndices(`${ee.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/h};
            for (var i: u32 = 0; i < ${f}; i++) {
              ${ue()}
              let b_value = ${f===1?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${j}>(${Array.from({length:4},(P,W)=>`${j}(b_value_lower[${W}]), ${j}(b_value_upper[${W}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${j}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(P,W)=>`${`dot(a_data${W}, b_dequantized_values[${W}])`}`).join(" + ")};
              word_offset += ${8/h};
            }
            workgroupBarrier();
          }

          if (local_idx < ${w}) {
            var output_value: ${oe.type.value} = ${oe.type.value}(0);
            for (var b = 0u; b < ${v}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${oe.setByIndices(`${oe.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${h};${f};${v};${w}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:g,dataType:c}],dispatchGroup:{x:T},programUniforms:I}),getShaderSource:N}},Vh=(e,t)=>{Yl(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(Ql(e.inputs,t)):e.compute(Zl(e.inputs,t))},Gh=e=>pe(e)}),Jl,ed,td,rd,id,nd,ad,sd,jh,R0=D(()=>{"use strict";J(),ne(),ae(),Jl=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},ed=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
            k = i32(${e.indicesGet("indices",n)}) - ${G("uniforms.pads",n,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${G("uniforms.x_shape",n,t)})) {
              break;
            }
            offset += k * i32(${G("uniforms.x_strides",n,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},td=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${G("uniforms.pads",n,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${G("uniforms.x_shape",n,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${G("uniforms.x_shape",n,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${G("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},rd=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${G("uniforms.pads",n,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${G("uniforms.x_shape",n,t)})) {
                  k = i32(${G("uniforms.x_shape",n,t)}) - 1;
                }
                offset += k * i32(${G("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},id=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${G("uniforms.pads",n,r)};
                if (k < 0)  {
                  k += i32(${G("uniforms.x_shape",n,t)}]);
                }
                if (k >= i32(${G("uniforms.x_shape",n,t)})) {
                  k -= i32(${G("uniforms.x_shape",n,t)});
                }
                offset += k * i32(${G("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},nd=(e,t,r)=>{switch(r.mode){case 0:return ed(e,t,r.pads.length);case 1:return td(e,t,r.pads.length);case 2:return rd(e,t,r.pads.length);case 3:return id(e,t,r.pads.length);default:throw new Error("Invalid mode")}},ad=(e,t)=>{let r=z.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,n=z.size(r),a=[{type:12,data:n},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&a.push({type:s?e[2].dataType:1,data:t.value}),a.push(...Y(e[0].dims,r));let o=["rank"],l=d=>{let c=V("output",e[0].dataType,r.length),h=A("x",e[0].dataType,i.length),f=h.type.value,g=nd(c,i.length,t),m=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&m.push({name:"constant_value",type:s?f:"f32"}),`
            ${d.registerUniforms(m).declareVariables(h,c)}
            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${c.offsetToIndices("global_idx")};

            var value = ${f}(0);
            ${g}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:o},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(z.size(r)/64)},programUniforms:a}),getShaderSource:l}},sd=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,n=e[0].dims.length,a=new Int32Array(2*n).fill(0);if(e.length>=4){let o=e[3].getBigInt64Array();for(let l=0;l<o.length;l++)a[Number(o[l])]=Number(r[l]),a[Number(o[l])+n]=Number(r[l+o.length])}else r.forEach((o,l)=>a[Number(l)]=Number(o));let s=[];return a.forEach(o=>s.push(o)),{mode:t.mode,value:i,pads:s}}else return t},jh=(e,t)=>{Jl(e.inputs);let r=sd(e.inputs,t);e.compute(ad(e.inputs,r),{inputs:[0]})}}),ur,Cn,On,zn,Rn,od,ud,Mn,An,Kh,Xh,Pn,Yh,Zh,Nn,Qh,Jh,ef,tf,M0=D(()=>{"use strict";Ye(),J(),ne(),ae(),ur=e=>{if(ge.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},Cn=(e,t,r)=>{let i=t.format==="NHWC",n=e.dims.slice();i&&n.splice(1,0,n.pop());let a=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),o=t.strides.slice(),l=a?t.dilations.slice():[],d=t.pads.slice();ti.adjustPoolAttributes(r,n,s,o,l,d);let c=ti.computePoolOutputShape(r,n,o,l,s,d,t.autoPad),h=Object.assign({},t);a?Object.assign(h,{kernelShape:s,strides:o,pads:d,dilations:l,cacheKey:t.cacheKey}):Object.assign(h,{kernelShape:s,strides:o,pads:d,cacheKey:t.cacheKey});let f=c.slice();return f.push(f.splice(1,1)[0]),[h,i?f:c]},On=(e,t)=>{let r=t.format==="NHWC",i=z.size(e),n=z.size(t.kernelShape),a=[{type:12,data:i},{type:12,data:n}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let o=t.kernelShape[t.kernelShape.length-1],l=t.strides[t.strides.length-1],d=t.pads[t.pads.length/2-1],c=t.pads[t.pads.length-1],h=!!(d+c);a.push({type:12,data:o},{type:12,data:l},{type:12,data:d},{type:12,data:c}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let f=!1;if(t.kernelShape.length===2){let g=t.kernelShape[t.kernelShape.length-2],m=t.strides[t.strides.length-2],w=t.pads[t.pads.length/2-2],v=t.pads[t.pads.length-2];f=!!(w+v),a.push({type:12,data:g},{type:12,data:m},{type:12,data:w},{type:12,data:v}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[a,s,!0,h,f]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let o=z.computeStrides(t.kernelShape);a.push({type:12,data:o},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:o.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let l=t.pads.reduce((d,c)=>d+c);return[a,s,!!l,!1,!1]}},zn=(e,t,r,i,n,a,s,o,l,d,c,h)=>{let f=n.format==="NHWC",g=t.type.value,m=V("output",t.type.tensor,i);if(n.kernelShape.length<=2){let w="",v="",x="",b=r-(f?2:1);if(c?w=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${b}] < 0 || xIndices[${b}]
                      >= uniforms.x_shape[${b}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${a}
                }`:w=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${a}
                }`,n.kernelShape.length===2){let S=r-(f?3:2);h?v=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${S}] = indices[${S}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${S}] < 0 || xIndices[${S}] >= uniforms.x_shape[${S}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:v=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${S}] = indices[${S}] * uniforms.sh - uniforms.phStart + j;
                `,x=`
              }
            `}return`
            ${e.registerUniforms(l).declareVariables(t,m)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${m.offsetToIndices("global_idx")};
              var xIndices = ${m.offsetToIndices("global_idx")};

              var value = ${g}(${o});
              var pad = 0;
              ${v}
              ${w}
              ${x}
              ${s}

              output[global_idx] = value;
            }`}else{if(f)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let w=n.kernelShape.length,v=n.pads.length,x="";return d?x=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${a}
              }`:x=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${a}
            `,`
            ${e.registerUniforms(l).declareVariables(t,m)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${m.offsetToIndices("global_idx")};
              var xIndices = ${m.offsetToIndices("global_idx")};

              var offsets: array<u32, ${w}>;

              var value = ${g}(${o});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${w-1}u; j++) {
                  offsets[j] = offset / ${G("uniforms.kernelStrides","j",w)};
                  offset -= offsets[j] * ${G("uniforms.kernelStrides","j",w)};
                }
                offsets[${w-1}] = offset;

                isPad = false;
                for (var j = ${r-w}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${G("uniforms.strides",`j - ${r-w}u`,w)}
                    + offsets[j - ${r-w}u] - ${G("uniforms.pads","j - 2u",v)};
                  ${x}
              }
              ${s}

              output[global_idx] = value;
            }`}},Rn=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,od=e=>`${Rn(e)};${e.countIncludePad}`,ud=e=>`${Rn(e)};${e.storageOrder};${e.dilations}`,Mn=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),An=(e,t,r,i)=>{let[n,a]=Cn(t,i,r),s=A("x",t.dataType,t.dims.length),o=s.type.value,l="value += x_val;",d="";n.countIncludePad?d+=`value /= ${o}(uniforms.kernelSize);`:d+=`value /= ${o}(i32(uniforms.kernelSize) - pad);`;let[c,h,f,g,m]=On(a,n);c.push(...Y(t.dims,a));let w=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${f};${g};${m}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(z.size(a)/64)},programUniforms:c}),getShaderSource:v=>zn(v,s,t.dims.length,a.length,n,l,d,0,h,f,g,m)}},Kh=e=>{let t=e.count_include_pad!==0,r=Mn(e);if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:od(i)}},Xh=(e,t)=>{ur(e.inputs),e.compute(An("AveragePool",e.inputs[0],!1,t))},Pn={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Yh=e=>{let t=e.format;return{format:t,...Pn,cacheKey:t}},Zh=(e,t)=>{ur(e.inputs),e.compute(An("GlobalAveragePool",e.inputs[0],!0,t))},Nn=(e,t,r,i)=>{let[n,a]=Cn(t,i,r),s=`
      value = max(x_val, value);
    `,o="",l=A("x",t.dataType,t.dims.length),d=["rank"],[c,h,f,g,m]=On(a,n);return c.push(...Y(t.dims,a)),{name:e,shaderCache:{hint:`${i.cacheKey};${f};${g};${m}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(z.size(a)/64)},programUniforms:c}),getShaderSource:w=>zn(w,l,t.dims.length,a.length,n,s,o,t.dataType===10?-65504:-1e5,h,f,g,m)}},Qh=(e,t)=>{ur(e.inputs),e.compute(Nn("MaxPool",e.inputs[0],!1,t))},Jh=e=>{let t=e.storage_order,r=e.dilations,i=Mn(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let n={storageOrder:t,dilations:r,...i,cacheKey:""};return{...n,cacheKey:ud(n)}},ef=e=>{let t=e.format;return{format:t,...Pn,cacheKey:t}},tf=(e,t)=>{ur(e.inputs),e.compute(Nn("GlobalMaxPool",e.inputs[0],!0,t))}}),ld,dd,rf,nf,A0=D(()=>{"use strict";J(),ne(),_e(),ae(),ld=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[0].dataType===6&&e.length>2)throw new Error("In the case of dequantizing int32 there is no zero point.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((n,a)=>a===t.axis||n===e[0].dims[a]).reduce((n,a)=>n&&a,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},dd=(e,t)=>{let r=z.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,n=i===3,a=e[0].dims,s=e[1].dataType,o=z.size(a),l=i===3||i===2,d=l?[Math.ceil(z.size(e[0].dims)/4)]:e[0].dims,c=e[1].dims,h=e.length>2?e[2]:void 0,f=h?l?[Math.ceil(z.size(h.dims)/4)]:h.dims:void 0,g=c.length===0||c.length===1&&c[0]===1,m=g===!1&&c.length===1,w=we(o),v=g&&(!l||w===4),x=v?w:1,b=v&&!l?w:1,S=A("input",l?12:i,d.length,b),T=A("scale",s,c.length),I=h?A("zero_point",l?12:i,f.length):void 0,C=V("output",s,a.length,x),k=[S,T];I&&k.push(I);let O=[d,c];h&&O.push(f);let N=[{type:12,data:o/x},{type:12,data:r},{type:12,data:t.blockSize},...Y(...O,a)],L=X=>{let F=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${X.registerUniforms(F).declareVariables(...k,C)}
      ${X.mainStart()}
          ${X.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${C.offsetToIndices("global_idx")};

          // Set input x
          ${l?`
            let input = ${S.getByOffset("global_idx / 4")};
            let x_vec = ${n?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${x===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${S.getByOffset("global_idx")};`};

          // Set scale input
          ${g?`let scale_value= ${T.getByOffset("0")}`:m?`
            let scale_index = ${C.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${T.getByOffset("scale_index")};`:`
            var scale_indices: ${T.type.indices} = output_indices;
            let index = ${T.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${T.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${T.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${I?g?l?`
                let zero_point_input = ${I.getByOffset("0")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${I.getByOffset("0")}`:m?l?`
                let zero_point_index = ${C.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${I.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${C.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${I.getByOffset("zero_point_index")};`:l?`
                let zero_point_offset = ${T.indicesToOffset("scale_indices")};
                let zero_point_input = ${I.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${I.getByIndices("scale_indices")};`:`let zero_point_value = ${l?n?"i32":"u32":S.type.value}(0);`};
      // Compute and write output
      ${C.setByOffset("global_idx",`${C.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:I?["rank","rank","rank"]:["rank","rank"]},getShaderSource:L,getRunData:()=>({outputs:[{dims:a,dataType:s}],dispatchGroup:{x:Math.ceil(o/x/64),y:1,z:1},programUniforms:N})}},rf=(e,t)=>{ld(e.inputs,t),e.compute(dd(e.inputs,t))},nf=e=>pe({axis:e.axis,blockSize:e.blockSize})}),cd,pd,af,P0=D(()=>{"use strict";Ye(),J(),ae(),cd=(e,t,r)=>{let i=e===t,n=e<t&&r<0,a=e>t&&r>0;if(i||n||a)throw new Error("Range these inputs' contents are invalid.")},pd=(e,t,r,i)=>{let n=Math.abs(Math.ceil((t-e)/r)),a=[n],s=n,o=[{type:12,data:s},{type:i,data:e},{type:i,data:r},...Y(a)],l=d=>{let c=V("output",i,a.length),h=c.type.value,f=[{name:"outputSize",type:"u32"},{name:"start",type:h},{name:"delta",type:h}];return`
        ${d.registerUniforms(f).declareVariables(c)}
        ${d.mainStart()}
        ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${h}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:l,getRunData:()=>({outputs:[{dims:a,dataType:i}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:o})}},af=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),ge.webgpu.validateInputContent&&cd(t,r,i),e.compute(pd(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),hd,Bn,Dn,fd,sf,of,N0=D(()=>{"use strict";J(),ne(),_e(),ae(),hd=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let n=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,a=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return i==="i32"||i==="u32"?`atomicAdd(&${t}, bitcast<${i}>(${r}));`:`
              ${n}bitcast<${i}>(oldValue) + (${r})${a}`;case"max":return i==="i32"||i==="u32"?`atomicMax(&${t}, bitcast<${i}>(${r}));`:`
                ${n}max(bitcast<f32>(oldValue), (${r}))${a}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${n}min(bitcast<${i}>(oldValue), (${r}))${a}`;case"mul":return`${n}(bitcast<${i}>(oldValue) * (${r}))${a}`;default:throw new Error(`Reduction ${e} is not supported.`)}},Bn=(e,t)=>`${e===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[${t?"i - indices_start":"i"}];
    let dim_value = uniforms.output_shape[${t?"i - indices_start":"i"} + uniforms.last_index_dimension];`}
    
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));`,Dn=(e,t,r)=>`for (var i = 0u; i < uniforms.num_updates_elements; i++) {
        let value = updates[uniforms.num_updates_elements * ${r?"global_idx":"idx"} + i];
        ${hd(e.reduction,"output[data_offset + i]","value",t)}
      }`,fd=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r,a=1,s=Math.ceil(z.size(i)/a),o=i[i.length-1],l=z.sizeFromDimension(r,o),d=z.sizeFromDimension(i,0)/o,c=[{type:12,data:s},{type:12,data:o},{type:12,data:l},...Y(e[1].dims,e[2].dims,n)],h=f=>{let g=A("indices",e[1].dataType,e[1].dims.length),m=A("updates",e[2].dataType,e[2].dims.length,a),w=t.reduction!=="none"&&t.reduction!==""?Ac("output",e[0].dataType,n.length):V("output",e[0].dataType,n.length,a);return`
      ${f.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(g,m,w)}
      ${f.mainStart()}
        ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var hasDuplicates = false;
  if (${t.reduction==="none"}) {
    for (var i = 0; i < ${d}; i = i + 1) {
      for (var j = i + 1; j < ${d}; j = j + 1) {
        var index_i = i32(indices[i].x);
        var index_j = i32(indices[j].x);
        if (index_i == index_j) {
          hasDuplicates = true;
          break;
        }
      }
      if (hasDuplicates) {
        break;
      }
    }
  }

  if (${t.reduction==="none"} && hasDuplicates) {
    if (global_idx != 0u) {
      return;
    }
    // Process each index-update pair individually when duplicates exist
    for (var idx = 0u; idx < ${d}u; idx++) {
      var data_offset = 0u;
      for (var i = 0u; i < uniforms.last_index_dimension; i++) {
        var index = i32(indices[idx * uniforms.last_index_dimension + i].x);
        ${Bn(r.length,!1)}
      }
      ${Dn(t,w.type.value,!1)}
    }
    return;
  }

  var data_offset = 0u;
  var indices_start = uniforms.last_index_dimension * global_idx;
  var indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${Bn(r.length,!0)}
  }
  ${Dn(t,w.type.value,!0)}
  }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:c}),getShaderSource:h}},sf=e=>pe({reduction:e.reduction}),of=(e,t)=>{e.compute(fd(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),md,gd,yd,Ln,bd,wd,_d,xd,$d,vd,Sd,Td,Un,Id,kd,Ed,Cd,Od,uf,lf,B0=D(()=>{"use strict";J(),ne(),_e(),ae(),md=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},gd=(e,t,r)=>{t.every(n=>n>=0&&n<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((n,a)=>i[n]=e[a]),i},yd=(e,t,r,i,n,a)=>{let[s,o,l]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],d=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(c=>a.push(c));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(o>0&&e.length>o&&e[o].dims.length===1&&e[o].dims[0]>0){if(e[o].getFloat32Array().forEach(c=>i.push(c)),i.length!==0&&i.length!==d&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");md(i,t),t.axes.length>0&&gd(i,t.axes,d).forEach((c,h)=>i[h]=c)}if(l>0&&e.length>l&&e[l].dims.length===1&&e[l].dims[0]>0&&(e[l].getBigInt64Array().forEach(c=>n.push(Number(c))),n.length!==0&&n.length!==d&&r>=18&&n.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(n.length!==0&&n.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof n<"u"&&i.length>0&&n.length>d)throw new Error("Resize requires only of scales or sizes to be specified")},Ln=(e,t,r,i)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${i}(big / (${r}));
  let fract = ${i}(big % (${r})) / ${i}(${r});
  return whole + fract;
`,bd=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${Ln("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${Ln("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",wd=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",_d=(e,t,r)=>{let i=new Array(r).fill(0).concat(new Array(r).fill(1)),n=e.length===0?i:e.slice();return t.length>0?(t.forEach((a,s)=>{i[a]=n[s],i[s+r]=n[t.length+s]}),i):n},xd=(e,t,r,i)=>{let n=[];if(r.length>0)if(i.length>0){if(e.forEach(a=>n.push(a)),Math.max(...i)>e.length)throw new Error("axes is out of bound");i.forEach((a,s)=>n[a]=r[s])}else r.forEach(a=>n.push(a));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");n=e.map((a,s)=>Math.round(a*t[s]))}return n},$d=(e,t,r)=>{let i=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(a=>t[a]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(a=>t[a]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let n=e.slice();return r.axes.length>0?(r.axes.forEach(a=>t[a]=i),r.axes.forEach(a=>n[a]=Math.round(e[a]*t[a]))):(t.fill(i,0,t.length),n.forEach((a,s)=>n[s]=Math.round(a*t[s]))),n},vd=(e,t,r,i,n)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${G("uniforms.scales","i",i)};
        var roi_low = ${G("uniforms.roi","i",n)};
        var roi_hi = ${G("uniforms.roi",`i + ${t.length}`,n)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${G("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${G("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Sd=(e,t,r,i,n,a,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${G("uniforms.scales","i",n)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${G("uniforms.roi","i",a)};
          var roi_hi = ${G("uniforms.roi",`i + ${r.length}`,a)};
          var input_shape_i = ${G("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${G("uniforms.output_shape","i",i.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,Td=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${G("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,Un=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",Id=(e,t,r,i,n)=>{let[a,s,o,l]=r.length===2?[-1,0,1,-1]:[0,2,3,1],d=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${d} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(col, ${r[o]} - 1))`)};
      ${Un(e,l,a,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${d} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${d} = originalIndices[${s}];
      var col:${d} = originalIndices[${o}];
      ${i?`if (row < 0 || row > (${r[s]} - 1) || col < 0 || col > (${r[o]} - 1)) {
        return ${n};
      }`:""};
      row = max(0, min(row, ${r[s]} - 1));
      col = max(0, min(col, ${r[o]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${a}])`:"0"};
      var x11: ${d} = getInputValue(batch, channel, row1, col1);
      var x12: ${d} = getInputValue(batch, channel, row1, col2);
      var x21: ${d} = getInputValue(batch, channel, row2, col1);
      var x22: ${d} = getInputValue(batch, channel, row2, col2);
      var dx1: ${d} = abs(row - ${d}(row1));
      var dx2: ${d} = abs(${d}(row2) - row);
      var dy1: ${d} = abs(col - ${d}(col1));
      var dy2: ${d} = abs(${d}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},kd=(e,t,r,i,n,a,s,o,l,d)=>{let c=r.length===2,h=!0,[f,g]=c?[0,1]:h?[2,3]:[1,2],m=e.type.value,w=v=>{let x=v===f?"row":"col";return`
      fn ${x}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${m} {
        var output_index = ${t.indicesGet("output_indices",v)};
        var originalIdx: ${m} = getOriginalCoordinateFromResizedCoordinate(output_index, ${n[v]},
        ${i[v]}, ${r[v]}, ${a[v]}, ${a[v]} + ${r.length});
        var fractOriginalIdx: ${m} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${o} && (originalIdx < 0 || originalIdx > (${r[v]} - 1))) {
          return ${l};
        }
        var data: array<${m}, 4> = array<${m}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${x}: ${m} = originalIdx + ${m}(i);
          if (${x} < 0 || ${x} >= ${r[v]}) {
            ${d?`coefs[i + 1] = 0.0;
                        continue;`:o?`return ${l};`:`${x} = max(0, min(${x}, ${r[v]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",v,`u32(${x})`)};
          data[i + 1] = ${v===f?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${w(f)};
    ${w(g)};
  fn getCubicInterpolationCoefs(s: ${m}) -> array<${m}, 4> {
    var absS = abs(s);
    var coeffs: array<${m}, 4> = array<${m}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${m} = 1.0 - absS;
    var twoMinusAbsS: ${m} = 2.0 - absS;
    var onePlusAbsS: ${m} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${m}, 4>, coefs: array<${m}, 4>) -> ${m} {
    var coefsSum: ${m} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${m} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},Ed=(e,t,r,i,n)=>{let[a,s,o,l,d]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],c=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${c} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(height, ${r[o]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(width, ${r[l]} - 1))`)};
      ${Un(e,d,a,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${c} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${c} = originalIndices[${s}];
      var height:${c} = originalIndices[${o}];
      var width:${c} = originalIndices[${l}];
      ${i?`if (depth < 0 || depth > (${r[s]} - 1) || height < 0 || height > (${r[o]} - 1) || width < 0 || (width > ${r[l]} - 1)) {
      return ${n};
        }`:""};

    depth = max(0, min(depth, ${r[s]} - 1));
      height = max(0, min(height, ${r[o]} - 1));
      width = max(0, min(width, ${r[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${a}])`:"0"};

      var x111: ${c} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${c} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${c} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${c} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${c} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${c} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${c} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${c} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${c} = abs(depth - ${c}(depth1));
      var dx2: ${c} = abs(${c}(depth2) - depth);
      var dy1: ${c} = abs(height - ${c}(height1));
      var dy2: ${c} = abs(${c}(height2) - height);
      var dz1: ${c} = abs(width - ${c}(width1));
      var dz2: ${c} = abs(${c}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},Cd=(e,t,r,i,n,a)=>{let s=e.dims,o=_d(a,t.axes,s.length),l=xd(s,i,n,t.axes),d=i.slice();i.length===0&&(d=s.map((b,S)=>b===0?1:l[S]/b),t.keepAspectRatioPolicy!=="stretch"&&(l=$d(s,d,t)));let c=V("output",e.dataType,l.length),h=A("input",e.dataType,s.length),f=z.size(l),g=s.length===l.length&&s.every((b,S)=>b===l[S]),m=t.coordinateTransformMode==="tf_crop_and_resize",w=t.extrapolationValue,v=h.type.value,x=b=>`
      ${g?"":`
      ${bd(t.coordinateTransformMode,v)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${Td(h,s)};
              ${wd(t.nearestMode,r,v)};
              ${Sd(h,c,s,l,d.length,o.length,m)};
              `;case"linear":return`
              ${vd(c,s,l,d.length,o.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${Id(h,c,s,m,w)}`;if(s.length===3||s.length===5)return`${Ed(h,c,s,m,w)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${kd(h,c,s,l,d,o,t.cubicCoeffA,m,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${b.registerUniform("output_size","u32").registerUniform("scales","f32",d.length).registerUniform("roi","f32",o.length).declareVariables(h,c)}
      ${b.mainStart()}
        ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${g?"output[global_idx] = input[global_idx];":`
        let output_indices = ${c.offsetToIndices("global_idx")};
        var input_indices: ${h.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${h.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${d.length>0?t.mode==="cubic"?d:d.length:""}|${n.length>0?n:""}|${o.length>0?o:""}|${g}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},{type:1,data:d},{type:1,data:o},...Y(s,l)]})}},Od=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},uf=(e,t)=>{let r=[],i=[],n=[],a=Od(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");yd(e.inputs,t,a,r,i,n),e.compute(Cd(e.inputs[0],t,a,r,i,n),{inputs:[0]})},lf=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,n=e.cubicCoeffA,a=e.excludeOutside!==0,s=e.extrapolationValue,o=e.keepAspectRatioPolicy,l=e.mode,d=e.nearestMode===""?"simple":e.nearestMode;return pe({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:n,excludeOutside:a,extrapolationValue:s,keepAspectRatioPolicy:o,mode:l,nearestMode:d})}}),zd,Rd,df,D0=D(()=>{"use strict";J(),ne(),ae(),zd=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let n=t.dims[t.dims.length-1],a=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==n)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==a)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==n)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Bias must have the same hidden size as input")}},Rd=(e,t,r,i)=>{let n=t.simplified,a=e[0].dims,s=z.size(a),o=a,l=s,d=a.slice(-1)[0],c=i?a.slice(0,-1).concat(1):[],h=!n&&e.length>3,f=e.length>4,g=i&&r>1,m=i&&r>2,w=r>3,v=64,x=we(d),b=[{type:12,data:l},{type:12,data:x},{type:12,data:d},{type:1,data:t.epsilon}],S=I=>{let C=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],k=[A("x",e[0].dataType,e[0].dims,x),A("skip",e[1].dataType,e[1].dims,x),A("gamma",e[2].dataType,e[2].dims,x)];h&&k.push(A("beta",e[3].dataType,e[3].dims,x)),f&&k.push(A("bias",e[4].dataType,e[4].dims,x)),k.push(V("output",e[0].dataType,o,x)),g&&k.push(V("mean_output",1,c)),m&&k.push(V("inv_std_output",1,c)),w&&k.push(V("input_skip_bias_sum",e[0].dataType,o,x));let O=Se(e[0].dataType),N=Se(1,x);return`

      ${I.registerUniforms(C).declareVariables(...k)}
      var<workgroup> sum_shared : array<${N}, ${v}>;
      var<workgroup> sum_squared_shared : array<${N}, ${v}>;

      ${I.mainStart([v,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${v};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${v};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${v-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${f?"bias[offset1d + i]":O+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${w?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Wt(O,x,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${v};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${gt("sum",x)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${gt("square_sum",x)} / f32(uniforms.hidden_size) ${n?"":"- mean * mean"} + uniforms.epsilon);
        ${g?"mean_output[global_idx] = mean;":""}
        ${m?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${n?"":`- ${O}(mean)`}) *
            ${O}(inv_std_dev) * gamma[offset1d + i]
            ${h?"+ beta[offset1d + i]":""};
        }
      }`},T=[{dims:o,dataType:e[0].dataType}];return r>1&&T.push({dims:c,dataType:1}),r>2&&T.push({dims:c,dataType:1}),r>3&&T.push({dims:a,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${x};${g};${m};${w}`,inputDependencies:e.map((I,C)=>"type")},getShaderSource:S,getRunData:()=>({outputs:T,dispatchGroup:{x:Math.ceil(l/d)},programUniforms:b})}},df=(e,t)=>{zd(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(Rd(e.inputs,t,e.outputCount,!1),{outputs:r})}}),Md,lr,Ad,Wn,Pd,Nd,cf,pf,L0=D(()=>{"use strict";J(),ne(),_e(),ae(),Md=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},lr=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},Ad=(e,t)=>{if(e.length>1){let r=lr(e,1),i=lr(e,2),n=lr(e,3);return n.length===0&&(n=[...Array(e[0].dims.length).keys()]),pe({starts:r,ends:i,axes:n})}else return t},Wn=(e,t,r,i,n)=>{let a=e;return e<0&&(a+=r[i[t]]),n[t]<0?Math.max(0,Math.min(a,r[i[t]]-1)):Math.max(0,Math.min(a,r[i[t]]))},Pd=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length}; i >= 0; i--) {
            let input_shape_i = ${G("uniforms.input_shape","i",r.length)};
            let steps_i = ${G("uniforms.steps","i",r.length)};
            let signs_i = ${G("uniforms.signs","i",r.length)};
            let starts_i = ${G("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,Nd=(e,t)=>{let r=e[0].dims,i=z.size(r),n=t.axes.length>0?z.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],a=lr(e,4);a.forEach(x=>x!==0||(()=>{throw new Error("step cannot be 0")})),a.length===0&&(a=Array(n.length).fill(1));let s=t.starts.map((x,b)=>Wn(x,b,r,n,a)),o=t.ends.map((x,b)=>Wn(x,b,r,n,a));if(n.length!==s.length||n.length!==o.length)throw new Error("start, ends and axes should have the same number of elements");if(n.length!==r.length)for(let x=0;x<r.length;++x)n.includes(x)||(s.splice(x,0,0),o.splice(x,0,r[x]),a.splice(x,0,1));let l=a.map(x=>Math.sign(x));a.forEach((x,b,S)=>{if(x<0){let T=(o[b]-s[b])/x,I=s[b],C=I+T*a[b];s[b]=C,o[b]=I,S[b]=-x}});let d=r.slice(0);n.forEach((x,b)=>{d[x]=Math.ceil((o[x]-s[x])/a[x])});let c={dims:d,dataType:e[0].dataType},h=V("output",e[0].dataType,d.length),f=A("input",e[0].dataType,e[0].dims.length),g=z.size(d),m=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:a.length}],w=[{type:12,data:g},{type:12,data:s},{type:6,data:l},{type:12,data:a},...Y(e[0].dims,d)],v=x=>`
      ${x.registerUniforms(m).declareVariables(f,h)}
        ${Pd(f,h,r)}
        ${x.mainStart()}
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${h.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${h.setByOffset("global_idx",f.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${l.length}_${s.length}_${a.length}`,inputDependencies:["rank"]},getShaderSource:v,getRunData:()=>({outputs:[c],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:w})}},cf=(e,t)=>{Md(e.inputs,t);let r=Ad(e.inputs,t);e.compute(Nd(e.inputs,r),{inputs:[0]})},pf=e=>{let t=e.starts,r=e.ends,i=e.axes;return pe({starts:t,ends:r,axes:i})}}),Bd,Dd,hf,ff,U0=D(()=>{"use strict";J(),ne(),_e(),yt(),ae(),Bd=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},Dd=(e,t)=>{let r=e.inputs[0],i=r.dims,n=z.size(i),a=i.length,s=z.normalizeAxis(t.axis,a),o=s<i.length-1,l,d=[];o?(d=Array.from({length:a},(k,O)=>O),d[s]=a-1,d[a-1]=s,l=e.compute(Pe(r,d),{inputs:[r],outputs:[-1]})[0]):l=r;let c=l.dims,h=c[a-1],f=n/h,g=we(h),m=h/g,w=64;f===1&&(w=256);let v=(k,O)=>O===4?`max(max(${k}.x, ${k}.y), max(${k}.z, ${k}.w))`:O===2?`max(${k}.x, ${k}.y)`:O===3?`max(max(${k}.x, ${k}.y), ${k}.z)`:k,x=A("x",l.dataType,l.dims,g),b=V("result",l.dataType,l.dims,g),S=x.type.value,T=Se(l.dataType)==="f32"?`var threadMax = ${S}(-3.402823e+38f);`:`var threadMax = ${S}(-65504.0h);`,I=k=>`
      var<workgroup> rowMaxShared : ${S};
      var<workgroup> rowSumShared : ${S};
      var<workgroup> threadShared : array<${S}, ${w}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${S} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${S}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${k.registerUniform("packedCols","i32").declareVariables(x,b)}
      ${k.mainStart(w)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${w};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${T}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${S}(${v("threadShared[0]",g)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${S}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${S}(${gt("threadShared[0]",g)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          let value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          setValue(row, col, row_stride, value);
        }
      }`,C=e.compute({name:"Softmax",shaderCache:{hint:`${g};${w}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:c,dataType:l.dataType}],dispatchGroup:{x:f},programUniforms:[{type:6,data:m}]}),getShaderSource:I},{inputs:[l],outputs:[o?-1:0]})[0];o&&e.compute(Pe(C,d),{inputs:[C]})},hf=(e,t)=>{Bd(e.inputs),Dd(e,t)},ff=e=>pe({axis:e.axis})}),qn,Ld,Ud,Wd,mf,W0=D(()=>{"use strict";J(),ne(),ae(),qn=e=>Array.from(e.getBigInt64Array(),Number),Ld=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(qn(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},Ud=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},Wd=(e,t)=>{let r=e[0].dims,i=t??qn(e[1]),n=Ud(r,i),a=z.size(n),s=e[0].dataType,o=A("input",s,r.length),l=V("output",s,n.length),d=c=>`
      const inputShape = ${o.indices(...r)};
      ${c.registerUniform("output_size","u32").declareVariables(o,l)}
      ${c.mainStart()}
      ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${l.offsetToIndices("global_idx")};
      var input_indices: ${o.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${o.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${l.indicesGet("output_indices","i")}  % input_dim_i;

        ${o.indicesSet("input_indices","i","input_dim_value")}
      }
      ${l.setByOffset("global_idx",o.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},...Y(e[0].dims,n)]}),getShaderSource:d}},mf=e=>{Ld(e.inputs),e.compute(Wd(e.inputs),{inputs:[0]})}}),qd,Hd,gf,q0=D(()=>{"use strict";J(),ne(),ae(),qd=(e,t,r,i,n)=>{let a=V("output_data",n,r.length,4),s=A("a_data",t[1].dataType,t[1].dims.length,4),o=A("b_data",t[2].dataType,t[2].dims.length,4),l=A("c_data",t[0].dataType,t[0].dims.length,4),d,c=(h,f,g)=>`select(${f}, ${h}, ${g})`;if(!i)d=a.setByOffset("global_idx",c(s.getByOffset("global_idx"),o.getByOffset("global_idx"),l.getByOffset("global_idx")));else{let h=(f,g,m="")=>{let w=`a_data[index_a${g}][component_a${g}]`,v=`b_data[index_b${g}][component_b${g}]`,x=`bool(c_data[index_c${g}] & (0xffu << (component_c${g} * 8)))`;return`
            let output_indices${g} = ${a.offsetToIndices(`global_idx * 4u + ${g}u`)};
            let offset_a${g} = ${s.broadcastedIndicesToOffset(`output_indices${g}`,a)};
            let offset_b${g} = ${o.broadcastedIndicesToOffset(`output_indices${g}`,a)};
            let offset_c${g} = ${l.broadcastedIndicesToOffset(`output_indices${g}`,a)};
            let index_a${g} = offset_a${g} / 4u;
            let index_b${g} = offset_b${g} / 4u;
            let index_c${g} = offset_c${g} / 4u;
            let component_a${g} = offset_a${g} % 4u;
            let component_b${g} = offset_b${g} % 4u;
            let component_c${g} = offset_c${g} % 4u;
            ${f}[${g}] = ${m}(${c(w,v,x)});
          `};n===9?d=`
            var data = vec4<u32>(0);
            ${h("data",0,"u32")}
            ${h("data",1,"u32")}
            ${h("data",2,"u32")}
            ${h("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:d=`
            ${h("output_data[global_idx]",0)}
            ${h("output_data[global_idx]",1)}
            ${h("output_data[global_idx]",2)}
            ${h("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(l,s,o,a)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${d}
      }`},Hd=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,n=e[1].dataType,a=!(z.areEqual(t,r)&&z.areEqual(r,i)),s=t,o=z.size(t);if(a){let d=qt.calcShape(qt.calcShape(t,r,!1),i,!1);if(!d)throw new Error("Can't perform where op on the given tensors");s=d,o=z.size(s)}let l=Math.ceil(o/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:d=>qd(d,e,s,a,n),getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(o/64/4)},programUniforms:[{type:12,data:l},...Y(i,t,r,s)]})}},gf=e=>{e.compute(Hd(e.inputs))}}),yf,H0=D(()=>{"use strict";i0(),Sa(),n0(),a0(),s0(),o0(),u0(),h0(),m0(),g0(),y0(),b0(),w0(),_0(),x0(),$0(),v0(),S0(),T0(),I0(),k0(),E0(),C0(),O0(),z0(),Ph(),R0(),M0(),A0(),P0(),N0(),va(),B0(),Uh(),D0(),L0(),U0(),Dh(),W0(),yt(),Ta(),q0(),yf=new Map([["Abs",[lp]],["Acos",[dp]],["Acosh",[cp]],["Add",[Vp]],["ArgMax",[ap,Jn]],["ArgMin",[np,Jn]],["Asin",[pp]],["Asinh",[hp]],["Atan",[fp]],["Atanh",[mp]],["Attention",[sp]],["AveragePool",[Xh,Kh]],["BatchNormalization",[op]],["BiasAdd",[up]],["BiasSplitGelu",[Fp]],["Cast",[yp,gp]],["Ceil",[wp]],["Clip",[bp]],["Concat",[th,rh]],["Conv",[aa,na]],["ConvTranspose",[ph,ch]],["Cos",[_p]],["Cosh",[xp]],["CumSum",[hh,fh]],["DepthToSpace",[mh,gh]],["DequantizeLinear",[rf,nf]],["Div",[Gp]],["Einsum",[yh,bh]],["Elu",[$p,fr]],["Equal",[jp]],["Erf",[vp]],["Exp",[Sp]],["Expand",[wh]],["FastGelu",[_h]],["Floor",[Tp]],["FusedConv",[aa,na]],["Gather",[$h,xh]],["GatherElements",[Eh,kh]],["GatherBlockQuantized",[Th,Ih]],["GatherND",[vh,Sh]],["Gelu",[Ip]],["Gemm",[Oh,Ch]],["GlobalAveragePool",[Zh,Yh]],["GlobalMaxPool",[tf,ef]],["Greater",[Zp]],["GreaterOrEqual",[Jp]],["GridSample",[zh,Rh]],["GroupQueryAttention",[Wh]],["HardSigmoid",[Ap,Mp]],["InstanceNormalization",[qh]],["LayerNormalization",[Hh]],["LeakyRelu",[kp,fr]],["Less",[Qp]],["LessOrEqual",[eh]],["Log",[qp]],["MatMul",[Fh]],["MatMulNBits",[Vh,Gh]],["MaxPool",[Qh,Jh]],["Mul",[Kp]],["MultiHeadAttention",[Ah,Mh]],["Neg",[Cp]],["Not",[Ep]],["Pad",[jh]],["Pow",[Xp]],["QuickGelu",[Hp,fr]],["Range",[af]],["Reciprocal",[Op]],["ReduceMin",[Jc]],["ReduceMean",[Kc]],["ReduceMax",[Qc]],["ReduceSum",[tp]],["ReduceProd",[ep]],["ReduceL1",[Xc]],["ReduceL2",[Yc]],["ReduceLogSum",[ip]],["ReduceLogSumExp",[Zc]],["ReduceSumSquare",[rp]],["Relu",[zp]],["Resize",[uf,lf]],["RotaryEmbedding",[Lh]],["ScatterND",[of,sf]],["Sigmoid",[Rp]],["Sin",[Pp]],["Sinh",[Np]],["Slice",[cf,pf]],["SkipLayerNormalization",[df]],["Split",[Nh,Bh]],["Sqrt",[Bp]],["Softmax",[hf,ff]],["Sub",[Yp]],["Tan",[Dp]],["Tanh",[Lp]],["ThresholdedRelu",[Wp,fr]],["Tile",[mf]],["Transpose",[Nc,Bc]],["Where",[gf]]])}),bf,F0=D(()=>{"use strict";Ye(),st(),ae(),bf=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,n){Xe(e.programInfo.name);let a=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let o=[];for(let d of t)o.push({binding:o.length,resource:{buffer:d.buffer}});for(let d of r)o.push({binding:o.length,resource:{buffer:d.buffer}});n&&o.push({binding:o.length,resource:n});let l=a.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:o,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let d={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(d)}s.setPipeline(e.computePipeline),s.setBindGroup(0,l),s.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),We(e.programInfo.name)}dispose(){}build(e,t){Xe(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(d=>{r.features.has(d.feature)&&i.push(`enable ${d.extension};`)});let n=Pc(t,this.backend.device.limits),a=e.getShaderSource(n),s=`${i.join(`
`)}
${n.additionalImplementations}
${a}`,o=r.createShaderModule({code:s,label:e.name});le("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let l=r.createComputePipeline({compute:{module:o,entryPoint:"main"},layout:"auto",label:e.name});return We(e.name),{programInfo:e,computePipeline:l,uniformVariablesInfo:n.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,n=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=n&&r<=n&&i<=n)return[t,r,i];let a=t*r*i,s=Math.ceil(Math.sqrt(a));if(s>n){if(s=Math.ceil(Math.cbrt(a)),s>n)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),wf={};Ft(wf,{WebGpuBackend:()=>_f});var Fd,Vd,Gd,_f,V0=D(()=>{"use strict";Ye(),J(),st(),Oc(),t0(),H0(),F0(),Fd=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let n=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${n}`);break}case"rank":{let a=e[i].dims.length;r.push(`${n};${a}`);break}case"dims":{let a=e[i].dims.join(",");r.push(`${n};${a}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},Vd=(e,t,r)=>{let i=e.name;return e.shaderCache?.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${Fd(t,e.shaderCache?.inputDependencies??new Array(t.length).fill("dims"))}`,i},Gd=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},_f=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},n=a=>t.features.has(a)&&r.push(a)&&!0;n("chromium-experimental-timestamp-query-inside-passes")||n("timestamp-query"),n("shader-f16"),n("subgroups"),this.device=await t.requestDevice(i),this.adapterInfo=new Gd(t.info||await t.requestAdapterInfo()),this.gpuDataManager=Mc(this),this.programManager=new bf(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,wa(e.logLevel,!!e.debug),this.device.onuncapturederror=a=>{a.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${a.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;Xe(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let i=0;i<t.length/2;i++){let n=r[i],a=n.kernelId,s=this.kernels.get(a),o=s.kernelType,l=s.kernelName,d=n.programName,c=n.inputTensorViews,h=n.outputTensorViews,f=t[i*2],g=t[i*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=f);let m=Number(f-this.queryTimeBase),w=Number(g-this.queryTimeBase);if(!Number.isSafeInteger(m)||!Number.isSafeInteger(w))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:c.map(v=>({dims:v.dims,dataType:at(v.dataType)})),outputsMetadata:h.map(v=>({dims:v.dims,dataType:at(v.dataType)})),kernelId:a,kernelType:o,kernelName:l,programName:d,startTime:m,endTime:w});else{let v="";c.forEach((b,S)=>{v+=`input[${S}]: [${b.dims}] | ${at(b.dataType)}, `});let x="";h.forEach((b,S)=>{x+=`output[${S}]: [${b.dims}] | ${at(b.dataType)}, `}),console.log(`[profiling] kernel "${a}|${o}|${l}|${d}" ${v}${x}execution time: ${w-m} ns`)}br("GPU",`${d}::${f}::${g}`)}e.unmap(),this.pendingQueries.delete(e)}),We()}run(e,t,r,i,n,a){Xe(e.name);let s=[];for(let b=0;b<t.length;++b){let S=t[b].data;if(S===0)continue;let T=this.gpuDataManager.get(S);if(!T)throw new Error(`no GPU data for input: ${S}`);s.push(T)}let{outputs:o,dispatchGroup:l,programUniforms:d}=e.getRunData(t),c=r.length===0?o.map((b,S)=>S):r;if(c.length!==o.length)throw new Error(`Output size ${c.length} must be equal to ${o.length}.`);let h=[],f=[];for(let b=0;b<o.length;++b){if(!Number.isInteger(c[b])||c[b]<-3||c[b]>=a)throw new Error(`Invalid output index: ${c[b]}`);if(c[b]===-3)continue;let S=c[b]===-1,T=c[b]===-2,I=S||T?n(o[b].dataType,o[b].dims):i(c[b],o[b].dataType,o[b].dims);if(h.push(I),I.data===0)continue;let C=this.gpuDataManager.get(I.data);if(!C)throw new Error(`no GPU data for output: ${I.data}`);if(S&&this.temporaryData.push(C),T){let k=this.kernelPersistentData.get(this.currentKernelId);k||(k=[],this.kernelPersistentData.set(this.currentKernelId,k)),k.push(C)}f.push(C)}if(s.length!==t.length||f.length!==h.length){if(f.length===0)return We(e.name),h;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let g;if(d){let b=0,S=[];d.forEach(k=>{let O=typeof k.data=="number"?[k.data]:k.data;if(O.length===0)return;let N=k.type===10?2:4,L,X;k.type===10?(X=O.length>4?16:O.length>2?8:O.length*N,L=O.length>4?16:N*O.length):(X=O.length<=2?O.length*N:16,L=16),b=Math.ceil(b/X)*X,S.push(b);let F=k.type===10?8:4;b+=O.length>4?Math.ceil(O.length/F)*L:O.length*N});let T=16;b=Math.ceil(b/T)*T;let I=new ArrayBuffer(b);d.forEach((k,O)=>{let N=S[O],L=typeof k.data=="number"?[k.data]:k.data;if(k.type===6)new Int32Array(I,N,L.length).set(L);else if(k.type===12)new Uint32Array(I,N,L.length).set(L);else if(k.type===10)new Uint16Array(I,N,L.length).set(L);else if(k.type===1)new Float32Array(I,N,L.length).set(L);else throw new Error(`Unsupported uniform type: ${at(k.type)}`)});let C=this.gpuDataManager.create(b,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(C.buffer,0,I,0,b),this.gpuDataManager.release(C.id),g={offset:0,size:b,buffer:C.buffer}}let m=this.programManager.normalizeDispatchGroupSize(l),w=m[1]===1&&m[2]===1,v=Vd(e,t,w),x=this.programManager.getArtifact(v);if(x||(x=this.programManager.build(e,m),this.programManager.setArtifact(v,x),le("info",()=>`[artifact] key: ${v}, programName: ${e.name}`)),d&&x.uniformVariablesInfo){if(d.length!==x.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${x.uniformVariablesInfo.length}, got ${d.length} in program "${x.programInfo.name}".`);for(let b=0;b<d.length;b++){let S=d[b],T=S.type,I=typeof S.data=="number"?1:S.data.length,[C,k]=x.uniformVariablesInfo[b];if(T!==C||I!==k)throw new Error(`Uniform variable ${b} mismatch: expect type ${C} with size ${k}, got type ${T} with size ${I} in program "${x.programInfo.name}".`)}}if(le("info",()=>`[ProgramManager] run "${e.name}" (key=${v}) with ${m[0]}x${m[1]}x${m[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let b={kernelId:this.currentKernelId,programName:x.programInfo.name,inputTensorViews:t,outputTensorViews:h};this.pendingKernels.push(b),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(b)}return this.programManager.run(x,s,f,m,g),We(e.name),h}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let n=yf.get(e);if(!n)throw new Error(`kernel not implemented: ${e}`);let a={kernelType:e,kernelName:i,kernelEntry:n[0],attributes:[n[1],r]};this.kernels.set(t,a)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let n=i.kernelType,a=i.kernelName,s=i.kernelEntry,o=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${n}] ${a}" is not allowed to be called recursively`);this.currentKernelId=e,o[0]&&(o[1]=o[0](o[1]),o[0]=void 0),le("info",()=>`[WebGPU] Start to run kernel "[${n}] ${a}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),s(t,o[1]),0}catch(d){return r.push(Promise.resolve(`[WebGPU] Kernel "[${n}] ${a}" failed. ${d}`)),1}finally{l&&r.push(this.device.popErrorScope().then(d=>d?`GPU validation error for kernel "[${n}] ${a}": ${d.message}`:null));for(let d of this.temporaryData)this.gpuDataManager.release(d.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let n=this.sessionExternalDataMapping.get(e);n||(n=new Map,this.sessionExternalDataMapping.set(e,n));let a=n.get(t),s=this.gpuDataManager.registerExternalBuffer(r,i,a);return n.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await Yn(this,e,t);return _a(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){le("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){le("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){le("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let n=this.getComputePassEncoder(),a=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),n.setPipeline(a.computePipeline),n.setBindGroup(0,a.bindGroup),n.dispatchWorkgroups(...a.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),xf={};Ft(xf,{init:()=>$f});var Kr,jd,$f,G0=D(()=>{"use strict";J(),st(),ne(),e0(),Kr=class vf{constructor(t,r,i,n){this.module=t,this.dataType=r,this.data=i,this.dims=n}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=z.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=z.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=z.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=z.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(z.size(t)!==z.size(this.dims))throw new Error("Invalid new shape");return new vf(this.module,this.dataType,this.data,t)}},jd=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let i=e.PTR_SIZE,n=r/e.PTR_SIZE,a=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*n++,a));let s=Number(e.getValue(i*n++,a));this.outputCount=Number(e.getValue(i*n++,a)),this.customDataOffset=Number(e.getValue(i*n++,"*")),this.customDataSize=Number(e.getValue(i*n++,a));let o=[];for(let l=0;l<s;l++){let d=Number(e.getValue(i*n++,a)),c=Number(e.getValue(i*n++,"*")),h=Number(e.getValue(i*n++,a)),f=[];for(let g=0;g<h;g++)f.push(Number(e.getValue(i*n++,a)));o.push(new Kr(e,d,c,f))}this.inputs=o}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let r=t?.inputs?.map(s=>typeof s=="number"?this.inputs[s]:s)??this.inputs,i=t?.outputs??[],n=(s,o,l)=>new Kr(this.module,o,this.output(s,l),l),a=(s,o)=>{let l=Ct(s,o);if(!l)throw new Error(`Unsupported data type: ${s}`);let d=l>0?this.backend.gpuDataManager.create(l).id:0;return new Kr(this.module,s,d,o)};return this.backend.run(e,r,i,n,a,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,n=i===4?"i32":"i64",a=this.module.stackAlloc((1+t.length)*i);this.module.setValue(a,t.length,n);for(let s=0;s<t.length;s++)this.module.setValue(a+i*(s+1),t[s],n);return this.module._JsepOutput(this.opKernelContext,e,a)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},$f=async(e,t,r,i)=>{let n=t.jsepInit;if(!n)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let a=(V0(),yr(wf)).WebGpuBackend,s=new a;await s.initialize(r,i),n("webgpu",[s,o=>s.alloc(Number(o)),o=>s.free(o),(o,l,d,c=!1)=>{if(c)le("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(o)}, dst=${Number(l)}, size=${Number(d)}`),s.memcpy(Number(o),Number(l));else{le("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(o)}, gpuDataId=${Number(l)}, size=${Number(d)}`);let h=t.HEAPU8.subarray(Number(o>>>0),Number(o>>>0)+Number(d));s.upload(Number(l),h)}},async(o,l,d)=>{le("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${o}, dataOffset=${l}, size=${d}`),await s.download(Number(o),()=>t.HEAPU8.subarray(Number(l)>>>0,Number(l+d)>>>0))},(o,l,d)=>s.createKernel(o,Number(l),d,t.UTF8ToString(t._JsepGetNodeName(Number(l)))),o=>s.releaseKernel(o),(o,l,d,c)=>{le("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${d}, kernel=${o}, contextDataOffset=${l}`);let h=new jd(t,s,Number(l));return s.computeKernel(Number(o),h,c)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let a=new Rc(r);n("webnn",[a,()=>a.reserveTensorId(),s=>a.releaseTensorId(s),async(s,o,l,d,c)=>a.ensureTensor(s,o,l,d,c),(s,o)=>{a.uploadTensor(s,o)},async(s,o)=>a.downloadTensor(s,o)])}}}),Kd,za,Ra,ft,Xd,Hn,ai,Ma,Aa,Fn,Pa,Na,Ba,Sf=D(()=>{"use strict";Zy(),Qy(),J(),At(),ma(),Ic(),Kd=(e,t)=>{me()._OrtInit(e,t)!==0&&he("Can't initialize onnxruntime.")},za=async e=>{Kd(e.wasm.numThreads,ei(e.logLevel))},Ra=async(e,t)=>{me().asyncInit?.();{let r=(G0(),yr(xf)).init;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");let i=e.webgpu.adapter;if(i){if(typeof i.limits!="object"||typeof i.features!="object"||typeof i.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let n=e.webgpu.powerPreference;if(n!==void 0&&n!=="low-power"&&n!=="high-performance")throw new Error(`Invalid powerPreference setting: "${n}"`);let a=e.webgpu.forceFallbackAdapter;if(a!==void 0&&typeof a!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${a}"`);if(i=await navigator.gpu.requestAdapter({powerPreference:n,forceFallbackAdapter:a}),!i)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}await r("webgpu",me(),e,i)}if(t==="webnn"){if(typeof navigator>"u"||!navigator.ml)throw new Error("WebNN is not supported in current environment");await r("webnn",me(),e)}}},ft=new Map,Xd=e=>{let t=me(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,n,n+i)!==0&&he("Can't get session input/output count.");let a=i===4?"i32":"i64";return[Number(t.getValue(n,a)),Number(t.getValue(n+i,a))]}finally{t.stackRestore(r)}},Hn=(e,t)=>{let r=me(),i=r.stackSave(),n=0;try{let a=r.PTR_SIZE,s=r.stackAlloc(2*a);r._OrtGetInputOutputMetadata(e,t,s,s+a)!==0&&he("Can't get session input/output metadata.");let o=Number(r.getValue(s,"*"));n=Number(r.getValue(s+a,"*"));let l=r.HEAP32[n/4];if(l===0)return[o,0];let d=r.HEAPU32[n/4+1],c=[];for(let h=0;h<d;h++){let f=Number(r.getValue(n+8+h*a,"*"));c.push(f!==0?r.UTF8ToString(f):Number(r.getValue(n+8+(h+d)*a,"*")))}return[o,l,c]}finally{r.stackRestore(i),n!==0&&r._OrtFree(n)}},ai=e=>{let t=me(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},Ma=async(e,t)=>{let r,i,n=me();Array.isArray(e)?[r,i]=e:e.buffer===n.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=ai(e);let a=0,s=0,o=0,l=[],d=[],c=[];try{if([s,l]=await Tc(t),t?.externalData&&n.mountExternalData){let T=[];for(let I of t.externalData){let C=typeof I=="string"?I:I.path;T.push(ba(typeof I=="string"?I:I.data).then(k=>{n.mountExternalData(C,k)}))}await Promise.all(T)}for(let T of t?.executionProviders??[])if((typeof T=="string"?T:T.name)==="webnn"){if(n.shouldTransferToMLTensor=!1,typeof T!="string"){let I=T,C=I?.context,k=I?.gpuDevice,O=I?.deviceType,N=I?.powerPreference;C?n.currentContext=C:k?n.currentContext=await n.webnnCreateMLContext(k):n.currentContext=await n.webnnCreateMLContext({deviceType:O,powerPreference:N})}else n.currentContext=await n.webnnCreateMLContext();break}a=await n._OrtCreateSession(r,i,s),n.webgpuOnCreateSession?.(a),a===0&&he("Can't create a session."),n.jsepOnCreateSession?.(),n.currentContext&&(n.webnnRegisterMLContext(a,n.currentContext),n.currentContext=void 0,n.shouldTransferToMLTensor=!0);let[h,f]=Xd(a),g=!!t?.enableGraphCapture,m=[],w=[],v=[],x=[],b=[];for(let T=0;T<h;T++){let[I,C,k]=Hn(a,T);I===0&&he("Can't get an input name."),d.push(I);let O=n.UTF8ToString(I);m.push(O),v.push(C===0?{name:O,isTensor:!1}:{name:O,isTensor:!0,type:at(C),shape:k})}for(let T=0;T<f;T++){let[I,C,k]=Hn(a,T+h);I===0&&he("Can't get an output name."),c.push(I);let O=n.UTF8ToString(I);w.push(O),x.push(C===0?{name:O,isTensor:!1}:{name:O,isTensor:!0,type:at(C),shape:k});{if(g&&t?.preferredOutputLocation===void 0){b.push("gpu-buffer");continue}let N=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[O]??"cpu",L=n.webnnIsGraphOutput;if(N==="cpu"&&L&&L(a,O)){b.push("ml-tensor-cpu-output");continue}if(N!=="cpu"&&N!=="cpu-pinned"&&N!=="gpu-buffer"&&N!=="ml-tensor")throw new Error(`Not supported preferred output location: ${N}.`);if(g&&N!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${N}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);b.push(N)}}let S=null;return b.some(T=>T==="gpu-buffer"||T==="ml-tensor"||T==="ml-tensor-cpu-output")&&(o=n._OrtCreateBinding(a),o===0&&he("Can't create IO binding."),S={handle:o,outputPreferredLocations:b,outputPreferredLocationsEncoded:b.map(T=>T==="ml-tensor-cpu-output"?"ml-tensor":T).map(T=>Kn(T))}),ft.set(a,[a,d,c,S,g,!1]),[a,m,w,v,x]}catch(h){throw d.forEach(f=>n._OrtFree(f)),c.forEach(f=>n._OrtFree(f)),o!==0&&n._OrtReleaseBinding(o)!==0&&he("Can't release IO binding."),a!==0&&n._OrtReleaseSession(a)!==0&&he("Can't release session."),h}finally{n._free(r),s!==0&&n._OrtReleaseSessionOptions(s)!==0&&he("Can't release session options."),l.forEach(h=>n._free(h)),n.unmountExternalData?.()}},Aa=e=>{let t=me(),r=ft.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,n,a,s,o]=r;s&&(o&&t._OrtClearBoundOutputs(s.handle)!==0&&he("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&he("Can't release IO binding.")),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),n.forEach(l=>t._OrtFree(l)),a.forEach(l=>t._OrtFree(l)),t._OrtReleaseSession(i)!==0&&he("Can't release session."),ft.delete(e)},Fn=async(e,t,r,i,n,a,s=!1)=>{if(!e){t.push(0);return}let o=me(),l=o.PTR_SIZE,d=e[0],c=e[1],h=e[3],f=h,g,m;if(d==="string"&&(h==="gpu-buffer"||h==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&h!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${a} when enableGraphCapture is true.`);if(h==="gpu-buffer"){let x=e[2].gpuBuffer;m=Ct(Et(d),c);{let b=o.jsepRegisterBuffer;if(!b)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');g=b(i,a,x,m)}}else if(h==="ml-tensor"){let x=e[2].mlTensor;m=Ct(Et(d),c);let b=o.webnnRegisterMLTensor;if(!b)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');g=b(i,x,Et(d),c)}else{let x=e[2];if(Array.isArray(x)){m=l*x.length,g=o._malloc(m),r.push(g);for(let b=0;b<x.length;b++){if(typeof x[b]!="string")throw new TypeError(`tensor data at index ${b} is not a string`);o.setValue(g+b*l,je(x[b],r),"*")}}else{let b=o.webnnIsGraphInput,S=o.webnnIsGraphOutput;if(d!=="string"&&b&&S){let T=o.UTF8ToString(n);if(b(i,T)||S(i,T)){let I=Et(d);m=Ct(I,c),f="ml-tensor";let C=o.webnnCreateTemporaryTensor,k=o.webnnUploadTensor;if(!C||!k)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let O=await C(i,I,c);k(O,new Uint8Array(x.buffer,x.byteOffset,x.byteLength)),g=O}else m=x.byteLength,g=o._malloc(m),r.push(g),o.HEAPU8.set(new Uint8Array(x.buffer,x.byteOffset,m),g)}else m=x.byteLength,g=o._malloc(m),r.push(g),o.HEAPU8.set(new Uint8Array(x.buffer,x.byteOffset,m),g)}}let w=o.stackSave(),v=o.stackAlloc(4*c.length);try{c.forEach((b,S)=>o.setValue(v+S*l,b,l===4?"i32":"i64"));let x=o._OrtCreateTensor(Et(d),g,m,v,c.length,Kn(f));x===0&&he(`Can't create tensor for input/output. session=${i}, index=${a}.`),t.push(x)}finally{o.stackRestore(w)}},Pa=async(e,t,r,i,n,a)=>{let s=me(),o=s.PTR_SIZE,l=ft.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let d=l[0],c=l[1],h=l[2],f=l[3],g=l[4],m=l[5],w=t.length,v=i.length,x=0,b=[],S=[],T=[],I=[],C=s.stackSave(),k=s.stackAlloc(w*o),O=s.stackAlloc(w*o),N=s.stackAlloc(v*o),L=s.stackAlloc(v*o);try{[x,b]=Sc(a);for(let U=0;U<w;U++)await Fn(r[U],S,I,e,c[t[U]],t[U],g);for(let U=0;U<v;U++)await Fn(n[U],T,I,e,h[i[U]],w+i[U],g);for(let U=0;U<w;U++)s.setValue(k+U*o,S[U],"*"),s.setValue(O+U*o,c[t[U]],"*");for(let U=0;U<v;U++)s.setValue(N+U*o,T[U],"*"),s.setValue(L+U*o,h[i[U]],"*");if(f&&!m){let{handle:U,outputPreferredLocations:re,outputPreferredLocationsEncoded:Z}=f;if(c.length!==w)throw new Error(`input count from feeds (${w}) is expected to be always equal to model's input count (${c.length}).`);for(let H=0;H<w;H++){let oe=t[H];await s._OrtBindInput(U,c[oe],S[H])!==0&&he(`Can't bind input[${H}] for session=${e}.`)}for(let H=0;H<v;H++){let oe=i[H];n[H]?.[3]?s._OrtBindOutput(U,h[oe],T[H],0)!==0&&he(`Can't bind pre-allocated output[${H}] for session=${e}.`):s._OrtBindOutput(U,h[oe],0,Z[oe])!==0&&he(`Can't bind output[${H}] to ${re[H]} for session=${e}.`)}ft.set(e,[d,c,h,f,g,!0])}s.jsepOnRunStart?.(d),s.webnnOnRunStart?.(d);let X;f?X=await s._OrtRunWithBinding(d,f.handle,v,N,x):X=await s._OrtRun(d,O,k,w,L,v,N,x),X!==0&&he("failed to call OrtRun().");let F=[],ee=[];for(let U=0;U<v;U++){let re=Number(s.getValue(N+U*o,"*"));if(re===T[U]){F.push(n[U]);continue}let Z=s.stackSave(),H=s.stackAlloc(4*o),oe=!1,j,ue=0;try{s._OrtGetTensorData(re,H,H+o,H+2*o,H+3*o)!==0&&he(`Can't access output tensor data on index ${U}.`);let P=o===4?"i32":"i64",W=Number(s.getValue(H,P));ue=s.getValue(H+o,"*");let te=s.getValue(H+o*2,"*"),R=Number(s.getValue(H+o*3,P)),ie=[];for(let ve=0;ve<R;ve++)ie.push(Number(s.getValue(te+ve*o,P)));s._OrtFree(te)!==0&&he("Can't free memory for tensor dims.");let Ee=ie.reduce((ve,be)=>ve*be,1);j=at(W);let Ne=f?.outputPreferredLocations[i[U]];if(j==="string"){if(Ne==="gpu-buffer"||Ne==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let ve=[];for(let be=0;be<Ee;be++){let Re=s.getValue(ue+be*o,"*"),ze=s.getValue(ue+(be+1)*o,"*"),_r=be===Ee-1?void 0:ze-Re;ve.push(s.UTF8ToString(Re,_r))}F.push([j,ie,ve,"cpu"])}else if(Ne==="gpu-buffer"&&Ee>0){let ve=s.jsepGetBuffer;if(!ve)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let be=ve(ue),Re=Ct(W,Ee);if(Re===void 0||!ga(j))throw new Error(`Unsupported data type: ${j}`);oe=!0,F.push([j,ie,{gpuBuffer:be,download:s.jsepCreateDownloader(be,Re,j),dispose:()=>{s._OrtReleaseTensor(re)!==0&&he("Can't release tensor.")}},"gpu-buffer"])}else if(Ne==="ml-tensor"&&Ee>0){let ve=s.webnnEnsureTensor,be=s.webnnIsGraphInputOutputTypeSupported;if(!ve||!be)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Ct(W,Ee)===void 0||!ya(j))throw new Error(`Unsupported data type: ${j}`);if(!be(e,j,!1))throw new Error(`preferredLocation "ml-tensor" for ${j} output is not supported by current WebNN Context.`);let Re=await ve(e,ue,W,ie,!1);oe=!0,F.push([j,ie,{mlTensor:Re,download:s.webnnCreateMLTensorDownloader(ue,j),dispose:()=>{s.webnnReleaseTensorId(ue),s._OrtReleaseTensor(re)}},"ml-tensor"])}else if(Ne==="ml-tensor-cpu-output"&&Ee>0){let ve=s.webnnCreateMLTensorDownloader(ue,j)(),be=F.length;oe=!0,ee.push((async()=>{let Re=[be,await ve];return s.webnnReleaseTensorId(ue),s._OrtReleaseTensor(re),Re})()),F.push([j,ie,[],"cpu"])}else{let ve=si(j),be=new ve(Ee);new Uint8Array(be.buffer,be.byteOffset,be.byteLength).set(s.HEAPU8.subarray(ue,ue+be.byteLength)),F.push([j,ie,be,"cpu"])}}finally{s.stackRestore(Z),j==="string"&&ue&&s._free(ue),oe||s._OrtReleaseTensor(re)}}f&&!g&&(s._OrtClearBoundOutputs(f.handle)!==0&&he("Can't clear bound outputs."),ft.set(e,[d,c,h,f,g,!1]));for(let[U,re]of await Promise.all(ee))F[U][2]=re;return F}finally{s.webnnOnRunEnd?.(d),s.stackRestore(C),S.forEach(X=>s._OrtReleaseTensor(X)),T.forEach(X=>s._OrtReleaseTensor(X)),I.forEach(X=>s._free(X)),x!==0&&s._OrtReleaseRunOptions(x),b.forEach(X=>s._free(X))}},Na=e=>{let t=me(),r=ft.get(e);if(!r)throw new Error("invalid session id");let i=r[0],n=t._OrtEndProfiling(i);n===0&&he("Can't get an profile file name."),t._OrtFree(n)},Ba=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),mt,Le,Ut,dr,cr,Xr,Vn,Yr,Tt,It,Yd,Tf,If,kf,Ef,Cf,Of,zf,Rf=D(()=>{"use strict";Ye(),Sf(),At(),ha(),mt=()=>!!ge.wasm.proxy&&typeof document<"u",Ut=!1,dr=!1,cr=!1,Yr=new Map,Tt=(e,t)=>{let r=Yr.get(e);r?r.push(t):Yr.set(e,[t])},It=()=>{if(Ut||!dr||cr||!Le)throw new Error("worker not ready")},Yd=e=>{switch(e.data.type){case"init-wasm":Ut=!1,e.data.err?(cr=!0,Vn[1](e.data.err)):(dr=!0,Vn[0]()),Xr&&(URL.revokeObjectURL(Xr),Xr=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Yr.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},Tf=async()=>{if(!dr){if(Ut)throw new Error("multiple calls to 'initWasm()' detected.");if(cr)throw new Error("previous call to 'initWasm()' failed.");if(Ut=!0,mt())return new Promise((e,t)=>{Le?.terminate(),$c().then(([r,i])=>{try{Le=i,Le.onerror=a=>t(a),Le.onmessage=Yd,Vn=[e,t];let n={type:"init-wasm",in:ge};!n.in.wasm.wasmPaths&&(r||jn)&&(n.in.wasm.wasmPaths={wasm:new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href}),Le.postMessage(n),Xr=r}catch(n){t(n)}},t)});try{await fa(ge.wasm),await za(ge),dr=!0}catch(e){throw cr=!0,e}finally{Ut=!1}}},If=async e=>{if(mt())return It(),new Promise((t,r)=>{Tt("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:ge}};Le.postMessage(i)});await Ra(ge,e)},kf=async e=>mt()?(It(),new Promise((t,r)=>{Tt("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};Le.postMessage(i,[e.buffer])})):ai(e),Ef=async(e,t)=>{if(mt()){if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return It(),new Promise((r,i)=>{Tt("create",[r,i]);let n={type:"create",in:{model:e,options:{...t}}},a=[];e instanceof Uint8Array&&a.push(e.buffer),Le.postMessage(n,a)})}else return Ma(e,t)},Cf=async e=>{if(mt())return It(),new Promise((t,r)=>{Tt("release",[t,r]);let i={type:"release",in:e};Le.postMessage(i)});Aa(e)},Of=async(e,t,r,i,n,a)=>{if(mt()){if(r.some(s=>s[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(n.some(s=>s))throw new Error("pre-allocated output tensor is not supported for proxy.");return It(),new Promise((s,o)=>{Tt("run",[s,o]);let l=r,d={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:i,options:a}};Le.postMessage(d,Ba(l))})}else return Pa(e,t,r,i,n,a)},zf=async e=>{if(mt())return It(),new Promise((t,r)=>{Tt("end-profiling",[t,r]);let i={type:"end-profiling",in:e};Le.postMessage(i)});Na(e)}}),Gn,Zd,Mf,j0=D(()=>{"use strict";Ye(),Rf(),J(),pa(),Ic(),Gn=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},Zd=e=>{switch(e[3]){case"cpu":return new Ke(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!ga(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:n}=e[2];return Ke.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:n})}case"ml-tensor":{let t=e[0];if(!ya(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:n}=e[2];return Ke.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:n})}default:throw new Error(`invalid data location: ${e[3]}`)}},Mf=class{async fetchModelAndCopyToWasmMemory(e){return kf(await ba(e))}async loadModel(e,t){Xe();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await Ef(r,t),We()}async dispose(){return Cf(this.sessionId)}async run(e,t,r){Xe();let i=[],n=[];Object.entries(e).forEach(h=>{let f=h[0],g=h[1],m=this.inputNames.indexOf(f);if(m===-1)throw new Error(`invalid input '${f}'`);i.push(g),n.push(m)});let a=[],s=[];Object.entries(t).forEach(h=>{let f=h[0],g=h[1],m=this.outputNames.indexOf(f);if(m===-1)throw new Error(`invalid output '${f}'`);a.push(g),s.push(m)});let o=i.map((h,f)=>Gn(h,()=>`input "${this.inputNames[n[f]]}"`)),l=a.map((h,f)=>h?Gn(h,()=>`output "${this.outputNames[s[f]]}"`):null),d=await Of(this.sessionId,n,o,s,l,r),c={};for(let h=0;h<d.length;h++)c[this.outputNames[s[h]]]=a[h]??Zd(d[h]);return We(),c}startProfiling(){}endProfiling(){zf(this.sessionId)}}}),Af={};Ft(Af,{OnnxruntimeWebAssemblyBackend:()=>ua,initializeFlags:()=>oa,wasmBackend:()=>Pf});var oa,ua,Pf,K0=D(()=>{"use strict";Ye(),Rf(),j0(),oa=()=>{(typeof ge.wasm.initTimeout!="number"||ge.wasm.initTimeout<0)&&(ge.wasm.initTimeout=0);let e=ge.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),ge.wasm.simd=!1),typeof ge.wasm.proxy!="boolean"&&(ge.wasm.proxy=!1),typeof ge.wasm.trace!="boolean"&&(ge.wasm.trace=!1),typeof ge.wasm.numThreads!="number"||!Number.isInteger(ge.wasm.numThreads)||ge.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)ge.wasm.numThreads=1;else{let t=typeof navigator>"u"?Ay("node:os").cpus().length:navigator.hardwareConcurrency;ge.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},ua=class{async init(e){oa(),await Tf(),await If(e)}async createInferenceSessionHandler(e,t){let r=new Mf;return await r.loadModel(e,t),r}},Pf=new ua});Ye();Ye();Ye();var X0="1.22.0",Y0=gc;{let e=(K0(),yr(Af)).wasmBackend;Ot("webgpu",e,5),Ot("webnn",e,5),Ot("cpu",e,10),Ot("wasm",e,10)}Object.defineProperty(ge.versions,"web",{value:X0,enumerable:!0});export{Oy as PaddleOcrService,Nf as ort};
