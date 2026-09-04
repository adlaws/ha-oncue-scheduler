var HaOnCueSchedulerPanel=function(x){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var qe;const te=globalThis,ce=te.ShadowRoot&&(te.ShadyCSS===void 0||te.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,de=Symbol(),$e=new WeakMap;let we=class{constructor(e,s,i){if(this._$cssResult$=!0,i!==de)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=s}get styleSheet(){let e=this.o;const s=this.t;if(ce&&e===void 0){const i=s!==void 0&&s.length===1;i&&(e=$e.get(s)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&$e.set(s,e))}return e}toString(){return this.cssText}};const Ve=t=>new we(typeof t=="string"?t:t+"",void 0,de),D=(t,...e)=>{const s=t.length===1?t[0]:e.reduce((i,o,r)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+t[r+1],t[0]);return new we(s,t,de)},Ke=(t,e)=>{if(ce)t.adoptedStyleSheets=e.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(const s of e){const i=document.createElement("style"),o=te.litNonce;o!==void 0&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}},Pe=ce?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let s="";for(const i of e.cssRules)s+=i.cssText;return Ve(s)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ye,defineProperty:We,getOwnPropertyDescriptor:Ze,getOwnPropertyNames:Xe,getOwnPropertySymbols:Qe,getPrototypeOf:Ge}=Object,A=globalThis,Se=A.trustedTypes,Je=Se?Se.emptyScript:"",he=A.reactiveElementPolyfillSupport,V=(t,e)=>t,se={toAttribute(t,e){switch(e){case Boolean:t=t?Je:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=t!==null;break;case Number:s=t===null?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch{s=null}}return s}},pe=(t,e)=>!Ye(t,e),Ee={attribute:!0,type:String,converter:se,reflect:!1,useDefault:!1,hasChanged:pe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),A.litPropertyMetadata??(A.litPropertyMetadata=new WeakMap);let R=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,s=Ee){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(e,s),!s.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(e,i,s);o!==void 0&&We(this.prototype,e,o)}}static getPropertyDescriptor(e,s,i){const{get:o,set:r}=Ze(this.prototype,e)??{get(){return this[s]},set(n){this[s]=n}};return{get:o,set(n){const a=o==null?void 0:o.call(this);r==null||r.call(this,n),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ee}static _$Ei(){if(this.hasOwnProperty(V("elementProperties")))return;const e=Ge(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(V("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(V("properties"))){const s=this.properties,i=[...Xe(s),...Qe(s)];for(const o of i)this.createProperty(o,s[o])}const e=this[Symbol.metadata];if(e!==null){const s=litPropertyMetadata.get(e);if(s!==void 0)for(const[i,o]of s)this.elementProperties.set(i,o)}this._$Eh=new Map;for(const[s,i]of this.elementProperties){const o=this._$Eu(s,i);o!==void 0&&this._$Eh.set(o,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const s=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const o of i)s.unshift(Pe(o))}else e!==void 0&&s.push(Pe(e));return s}static _$Eu(e,s){const i=s.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(s=>s(this))}addController(e){var s;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((s=e.hostConnected)==null||s.call(e))}removeController(e){var s;(s=this._$EO)==null||s.delete(e)}_$E_(){const e=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ke(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostDisconnected)==null?void 0:i.call(s)})}attributeChangedCallback(e,s,i){this._$AK(e,i)}_$ET(e,s){var r;const i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(o!==void 0&&i.reflect===!0){const n=(((r=i.converter)==null?void 0:r.toAttribute)!==void 0?i.converter:se).toAttribute(s,i.type);this._$Em=e,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(e,s){var r,n;const i=this.constructor,o=i._$Eh.get(e);if(o!==void 0&&this._$Em!==o){const a=i.getPropertyOptions(o),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((r=a.converter)==null?void 0:r.fromAttribute)!==void 0?a.converter:se;this._$Em=o;const d=l.fromAttribute(s,a.type);this[o]=d??((n=this._$Ej)==null?void 0:n.get(o))??d,this._$Em=null}}requestUpdate(e,s,i,o=!1,r){var n;if(e!==void 0){const a=this.constructor;if(o===!1&&(r=this[e]),i??(i=a.getPropertyOptions(e)),!((i.hasChanged??pe)(r,s)||i.useDefault&&i.reflect&&r===((n=this._$Ej)==null?void 0:n.get(e))&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,s,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,s,{useDefault:i,reflect:o,wrapped:r},n){i&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??s??this[e]),r!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(s=void 0),this._$AL.set(e,s)),o===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[r,n]of o){const{wrapped:a}=n,l=this[r];a!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,n,l)}}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(i=this._$EO)==null||i.forEach(o=>{var r;return(r=o.hostUpdate)==null?void 0:r.call(o)}),this.update(s)):this._$EM()}catch(o){throw e=!1,this._$EM(),o}e&&this._$AE(s)}willUpdate(e){}_$AE(e){var s;(s=this._$EO)==null||s.forEach(i=>{var o;return(o=i.hostUpdated)==null?void 0:o.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(s=>this._$ET(s,this[s]))),this._$EM()}updated(e){}firstUpdated(e){}};R.elementStyles=[],R.shadowRootOptions={mode:"open"},R[V("elementProperties")]=new Map,R[V("finalized")]=new Map,he==null||he({ReactiveElement:R}),(A.reactiveElementVersions??(A.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const K=globalThis,Ce=t=>t,ie=K.trustedTypes,De=ie?ie.createPolicy("lit-html",{createHTML:t=>t}):void 0,ke="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,Te="?"+M,et=`<${Te}>`,O=document,Y=()=>O.createComment(""),W=t=>t===null||typeof t!="object"&&typeof t!="function",ue=Array.isArray,tt=t=>ue(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",_e=`[ 	
\f\r]`,Z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ae=/-->/g,Me=/>/g,H=RegExp(`>|${_e}(?:([^\\s"'>=/]+)(${_e}*=${_e}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ie=/'/g,Oe=/"/g,He=/^(?:script|style|textarea|title)$/i,ze=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),c=ze(1),st=ze(2),j=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Ne=new WeakMap,z=O.createTreeWalker(O,129);function Re(t,e){if(!ue(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return De!==void 0?De.createHTML(e):e}const it=(t,e)=>{const s=t.length-1,i=[];let o,r=e===2?"<svg>":e===3?"<math>":"",n=Z;for(let a=0;a<s;a++){const l=t[a];let d,g,u=-1,m=0;for(;m<l.length&&(n.lastIndex=m,g=n.exec(l),g!==null);)m=n.lastIndex,n===Z?g[1]==="!--"?n=Ae:g[1]!==void 0?n=Me:g[2]!==void 0?(He.test(g[2])&&(o=RegExp("</"+g[2],"g")),n=H):g[3]!==void 0&&(n=H):n===H?g[0]===">"?(n=o??Z,u=-1):g[1]===void 0?u=-2:(u=n.lastIndex-g[2].length,d=g[1],n=g[3]===void 0?H:g[3]==='"'?Oe:Ie):n===Oe||n===Ie?n=H:n===Ae||n===Me?n=Z:(n=H,o=void 0);const E=n===H&&t[a+1].startsWith("/>")?" ":"";r+=n===Z?l+et:u>=0?(i.push(d),l.slice(0,u)+ke+l.slice(u)+M+E):l+M+(u===-2?a:E)}return[Re(t,r+(t[s]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]};class X{constructor({strings:e,_$litType$:s},i){let o;this.parts=[];let r=0,n=0;const a=e.length-1,l=this.parts,[d,g]=it(e,s);if(this.el=X.createElement(d,i),z.currentNode=this.el.content,s===2||s===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(o=z.nextNode())!==null&&l.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(const u of o.getAttributeNames())if(u.endsWith(ke)){const m=g[n++],E=o.getAttribute(u).split(M),T=/([.?@])?(.*)/.exec(m);l.push({type:1,index:r,name:T[2],strings:E,ctor:T[1]==="."?rt:T[1]==="?"?nt:T[1]==="@"?at:oe}),o.removeAttribute(u)}else u.startsWith(M)&&(l.push({type:6,index:r}),o.removeAttribute(u));if(He.test(o.tagName)){const u=o.textContent.split(M),m=u.length-1;if(m>0){o.textContent=ie?ie.emptyScript:"";for(let E=0;E<m;E++)o.append(u[E],Y()),z.nextNode(),l.push({type:2,index:++r});o.append(u[m],Y())}}}else if(o.nodeType===8)if(o.data===Te)l.push({type:2,index:r});else{let u=-1;for(;(u=o.data.indexOf(M,u+1))!==-1;)l.push({type:7,index:r}),u+=M.length-1}r++}}static createElement(e,s){const i=O.createElement("template");return i.innerHTML=e,i}}function B(t,e,s=t,i){var n,a;if(e===j)return e;let o=i!==void 0?(n=s._$Co)==null?void 0:n[i]:s._$Cl;const r=W(e)?void 0:e._$litDirective$;return(o==null?void 0:o.constructor)!==r&&((a=o==null?void 0:o._$AO)==null||a.call(o,!1),r===void 0?o=void 0:(o=new r(t),o._$AT(t,s,i)),i!==void 0?(s._$Co??(s._$Co=[]))[i]=o:s._$Cl=o),o!==void 0&&(e=B(t,o._$AS(t,e.values),o,i)),e}class ot{constructor(e,s){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:s},parts:i}=this._$AD,o=((e==null?void 0:e.creationScope)??O).importNode(s,!0);z.currentNode=o;let r=z.nextNode(),n=0,a=0,l=i[0];for(;l!==void 0;){if(n===l.index){let d;l.type===2?d=new Q(r,r.nextSibling,this,e):l.type===1?d=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(d=new lt(r,this,e)),this._$AV.push(d),l=i[++a]}n!==(l==null?void 0:l.index)&&(r=z.nextNode(),n++)}return z.currentNode=O,o}p(e){let s=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,s),s+=i.strings.length-2):i._$AI(e[s])),s++}}class Q{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,s,i,o){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=s,this._$AM=i,this.options=o,this._$Cv=(o==null?void 0:o.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const s=this._$AM;return s!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=s.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,s=this){e=B(this,e,s),W(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==j&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):tt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&W(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){var r;const{values:s,_$litType$:i}=e,o=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=X.createElement(Re(i.h,i.h[0]),this.options)),i);if(((r=this._$AH)==null?void 0:r._$AD)===o)this._$AH.p(s);else{const n=new ot(o,this),a=n.u(this.options);n.p(s),this.T(a),this._$AH=n}}_$AC(e){let s=Ne.get(e.strings);return s===void 0&&Ne.set(e.strings,s=new X(e)),s}k(e){ue(this._$AH)||(this._$AH=[],this._$AR());const s=this._$AH;let i,o=0;for(const r of e)o===s.length?s.push(i=new Q(this.O(Y()),this.O(Y()),this,this.options)):i=s[o],i._$AI(r),o++;o<s.length&&(this._$AR(i&&i._$AB.nextSibling,o),s.length=o)}_$AR(e=this._$AA.nextSibling,s){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,s);e!==this._$AB;){const o=Ce(e).nextSibling;Ce(e).remove(),e=o}}setConnected(e){var s;this._$AM===void 0&&(this._$Cv=e,(s=this._$AP)==null||s.call(this,e))}}class oe{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,s,i,o,r){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=s,this._$AM=o,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=p}_$AI(e,s=this,i,o){const r=this.strings;let n=!1;if(r===void 0)e=B(this,e,s,0),n=!W(e)||e!==this._$AH&&e!==j,n&&(this._$AH=e);else{const a=e;let l,d;for(e=r[0],l=0;l<r.length-1;l++)d=B(this,a[i+l],s,l),d===j&&(d=this._$AH[l]),n||(n=!W(d)||d!==this._$AH[l]),d===p?e=p:e!==p&&(e+=(d??"")+r[l+1]),this._$AH[l]=d}n&&!o&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class rt extends oe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}}class nt extends oe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}}class at extends oe{constructor(e,s,i,o,r){super(e,s,i,o,r),this.type=5}_$AI(e,s=this){if((e=B(this,e,s,0)??p)===j)return;const i=this._$AH,o=e===p&&i!==p||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==p&&(i===p||o);o&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var s;typeof this._$AH=="function"?this._$AH.call(((s=this.options)==null?void 0:s.host)??this.element,e):this._$AH.handleEvent(e)}}class lt{constructor(e,s,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=s,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){B(this,e)}}const fe=K.litHtmlPolyfillSupport;fe==null||fe(X,Q),(K.litHtmlVersions??(K.litHtmlVersions=[])).push("3.3.3");const ct=(t,e,s)=>{const i=(s==null?void 0:s.renderBefore)??e;let o=i._$litPart$;if(o===void 0){const r=(s==null?void 0:s.renderBefore)??null;i._$litPart$=o=new Q(e.insertBefore(Y(),r),r,void 0,s??{})}return o._$AI(t),o};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const N=globalThis;class w extends R{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var s;const e=super.createRenderRoot();return(s=this.renderOptions).renderBefore??(s.renderBefore=e.firstChild),e}update(e){const s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ct(s,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return j}}w._$litElement$=!0,w.finalized=!0,(qe=N.litElementHydrateSupport)==null||qe.call(N,{LitElement:w});const ge=N.litElementPolyfillSupport;ge==null||ge({LitElement:w}),(N.litElementVersions??(N.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I=t=>(e,s)=>{s!==void 0?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dt={attribute:!0,type:String,converter:se,reflect:!1,hasChanged:pe},ht=(t=dt,e,s)=>{const{kind:i,metadata:o}=s;let r=globalThis.litPropertyMetadata.get(o);if(r===void 0&&globalThis.litPropertyMetadata.set(o,r=new Map),i==="setter"&&((t=Object.create(t)).wrapped=!0),r.set(s.name,t),i==="accessor"){const{name:n}=s;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(n,l,t,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,t,a),a}}}if(i==="setter"){const{name:n}=s;return function(a){const l=this[n];e.call(this,a),this.requestUpdate(n,l,t,!0,a)}}throw Error("Unsupported decorator location: "+i)};function v(t){return(e,s)=>typeof s=="object"?ht(t,e,s):((i,o,r)=>{const n=o.hasOwnProperty(r);return o.constructor.createProperty(r,i),n?Object.getOwnPropertyDescriptor(o,r):void 0})(t,e,s)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function h(t){return v({...t,state:!0,attribute:!1})}const U=D`
  :host {
    display: block;
    font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
    color: var(--primary-text-color, #212121);
    --ss-primary: var(--primary-color, #03a9f4);
    --ss-bg: var(--card-background-color, #fff);
    --ss-border: var(--divider-color, #e0e0e0);
    --ss-sidebar-width: 280px;
    --ss-cell-on: var(--primary-color, #03a9f4);
    --ss-cell-off: var(--secondary-background-color, #f5f5f5);
    --ss-cell-size: 12px;
  }

  .card {
    background: var(--ss-bg);
    border-radius: 8px;
    padding: 16px;
    box-shadow: var(--ha-card-box-shadow, 0 2px 2px rgba(0, 0, 0, 0.14));
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    font-family: inherit;
  }

  button.primary {
    background: var(--ss-primary);
    color: #fff;
  }

  button.secondary {
    background: var(--ss-border);
    color: var(--primary-text-color, #212121);
  }

  button.danger {
    background: var(--error-color, #db4437);
    color: #fff;
  }

  input,
  select,
  textarea {
    font-family: inherit;
    font-size: 14px;
    padding: 8px;
    border: 1px solid var(--ss-border);
    border-radius: 4px;
    background: var(--ss-bg);
    color: var(--primary-text-color, #212121);
    box-sizing: border-box;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: 2px solid var(--ss-primary);
    outline-offset: -1px;
  }

  input:disabled,
  select:disabled,
  textarea:disabled {
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--secondary-text-color, #727272);
    border-color: transparent;
    cursor: default;
  }

  label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 4px;
    color: var(--secondary-text-color, #727272);
  }

  .form-group {
    margin-bottom: 12px;
  }

  .warning-banner {
    background: var(--warning-color, #ff9800);
    color: #fff;
    padding: 8px 12px;
    border-radius: 4px;
    margin-bottom: 12px;
    font-size: 13px;
  }

  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
  }

  .badge-daily {
    background: #e3f2fd;
    color: #1565c0;
  }
  .badge-weekly {
    background: #e8f5e9;
    color: #2e7d32;
  }
  .badge-custom {
    background: #fff3e0;
    color: #e65100;
  }
`;var pt=Object.defineProperty,ut=Object.getOwnPropertyDescriptor,ve=(t,e,s,i)=>{for(var o=i>1?void 0:i?ut(e,s):e,r=t.length-1,n;r>=0;r--)(n=t[r])&&(o=(i?n(e,s,o):n(o))||o);return i&&o&&pt(e,s,o),o};let G=class extends w{constructor(){super(...arguments),this.schedules=[],this.selectedId=null}render(){return c`
      <div class="header">
        <h2>Schedules</h2>
        <button class="primary" @click=${this._onAdd}>+ Add</button>
      </div>
      <div class="list">
        ${this.schedules.length===0?c`<div class="empty">No schedules yet. Click + Add to create one.</div>`:this.schedules.map(t=>c`
                <div
                  class="item ${t.id===this.selectedId?"selected":""}"
                  @click=${()=>this._onSelect(t.id)}
                >
                  <div
                    class="status-dot ${t.active?"active":"paused"}"
                    title=${t.active?"Active":"Paused"}
                  ></div>
                  <div class="item-info">
                    <div class="item-name">${t.name}</div>
                    <div class="item-meta">
                      <span class="badge badge-${t.cadence}">${t.cadence}</span>
                      ${t.entity_ids.length} ${t.entity_ids.length!==1?"entities":"entity"}
                    </div>
                  </div>
                  <button
                    class="toggle-btn"
                    title=${t.active?"Pause schedule":"Resume schedule"}
                    @click=${e=>{e.stopPropagation(),this._onToggleActive(t.id,!t.active)}}
                  >${t.active?"Pause":"Resume"}</button>
                </div>
              `)}
      </div>
    `}_onSelect(t){this.dispatchEvent(new CustomEvent("schedule-selected",{detail:{id:t},bubbles:!0,composed:!0}))}_onAdd(){this.dispatchEvent(new CustomEvent("schedule-add",{bubbles:!0,composed:!0}))}_onToggleActive(t,e){this.dispatchEvent(new CustomEvent("schedule-toggle-active",{detail:{id:t,active:e},bubbles:!0,composed:!0}))}};G.styles=[U,D`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .header {
        padding: 16px;
        border-bottom: 1px solid var(--ss-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .header h2 {
        margin: 0;
        font-size: 16px;
      }
      .list {
        flex: 1;
        overflow-y: auto;
      }
      .item {
        padding: 12px 16px;
        cursor: pointer;
        border-bottom: 1px solid var(--ss-border);
        display: flex;
        align-items: center;
        gap: 8px;
        transition: background 0.15s;
      }
      .item:hover {
        background: var(--ss-cell-off);
      }
      .item.selected {
        background: color-mix(in srgb, var(--ss-primary) 15%, transparent);
        border-left: 3px solid var(--ss-primary);
      }
      .item-info {
        flex: 1;
        min-width: 0;
      }
      .item-name {
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .item-meta {
        font-size: 12px;
        color: var(--secondary-text-color, #727272);
        margin-top: 2px;
      }
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
        cursor: pointer;
        position: relative;
      }
      .status-dot.active {
        background: var(--success-color, #4caf50);
      }
      .status-dot.paused {
        background: var(--disabled-text-color, #bdbdbd);
      }
      .toggle-btn {
        background: none;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 4px;
        padding: 2px 8px;
        font-size: 11px;
        color: var(--secondary-text-color, #727272);
        cursor: pointer;
        flex-shrink: 0;
        line-height: 1.4;
      }
      .toggle-btn:hover {
        background: var(--secondary-background-color, #f5f5f5);
        color: var(--primary-text-color, #212121);
      }
      .empty {
        padding: 24px 16px;
        text-align: center;
        color: var(--secondary-text-color, #727272);
        font-size: 14px;
      }
    `],ve([v({type:Array})],G.prototype,"schedules",2),ve([v({type:String})],G.prototype,"selectedId",2),G=ve([I("schedule-list")],G);function L(t){return typeof t=="string"?{mode:"solid",color:t}:t}const _t=["#1a237e","#4fc3f7","#fff9c4","#ffcc80","#e0e0e0","#81d4fa","#ffab91","#c5e1a5","#b0bec5","#fff176"];function je(t){switch(t.mode){case"crossfade":return`linear-gradient(90deg, ${t.color}, ${t.color}80)`;case"cycle":{const e=t.colors&&t.colors.length>=2?t.colors:[t.color,"#888"];if(t.transition==="fade")return`linear-gradient(90deg, ${e.join(", ")})`;const s=e.length;return`linear-gradient(90deg, ${e.map((o,r)=>{const n=(r/s*100).toFixed(1),a=((r+1)/s*100).toFixed(1);return`${o} ${n}%, ${o} ${a}%`}).join(", ")})`}case"tv":return`linear-gradient(90deg, ${_t.join(", ")})`;default:return t.color}}var ft=Object.defineProperty,gt=Object.getOwnPropertyDescriptor,me=(t,e,s,i)=>{for(var o=i>1?void 0:i?gt(e,s):e,r=t.length-1,n;r>=0;r--)(n=t[r])&&(o=(i?n(e,s,o):n(o))||o);return i&&o&&ft(e,s,o),o};const be=new Map,re=new Map;async function vt(t){const e=be.get(t);if(e!==void 0)return e;const s=re.get(t);if(s)return s;const i=t.replace(/^mdi:/,""),o=fetch(`https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/${i}.svg`).then(r=>r.ok?r.text():"").then(r=>{const n=r.match(/\bd="([^"]+)"/),a=(n==null?void 0:n[1])??"";return be.set(t,a),re.delete(t),a}).catch(()=>(be.set(t,""),re.delete(t),""));return re.set(t,o),o}let J=class extends w{constructor(){super(...arguments),this.icon="",this._path="",this._haIconAvailable=customElements.get("ha-icon")!==void 0}willUpdate(t){t.has("icon")&&this.icon&&!this._haIconAvailable&&this._loadPath()}async _loadPath(){this._path="",this.icon&&(this._path=await vt(this.icon))}render(){return this.icon?this._haIconAvailable?c`<ha-icon .icon=${this.icon}></ha-icon>`:this._path?c`
      <svg viewBox="0 0 24 24">
        ${st`<path d=${this._path} />`}
      </svg>
    `:c``:c``}};J.styles=D`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--mdi-icon-size, var(--mdc-icon-size, 24px));
      height: var(--mdi-icon-size, var(--mdc-icon-size, 24px));
      vertical-align: middle;
    }
    svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
    ha-icon {
      --mdc-icon-size: var(--mdi-icon-size, var(--mdc-icon-size, 24px));
    }
  `,me([v({type:String})],J.prototype,"icon",2),me([h()],J.prototype,"_path",2),J=me([I("mdi-icon")],J);var mt=Object.defineProperty,bt=Object.getOwnPropertyDescriptor,y=(t,e,s,i)=>{for(var o=i>1?void 0:i?bt(e,s):e,r=t.length-1,n;r>=0;r--)(n=t[r])&&(o=(i?n(e,s,o):n(o))||o);return i&&o&&mt(e,s,o),o};const P=96,k=16,yt=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],ye=["0","1","2","3","4","5","6"];function xt(t){const e=parseInt(t.slice(1),16),s=e>>16&255,i=e>>8&255,o=e&255;return s*.299+i*.587+o*.114>160?"#000":"#fff"}let b=class extends w{constructor(){super(...arguments),this.cadence="daily",this.slots={},this.customDates=[],this.slotType="on_off",this.palette=[],this.hvacPresets=[],this.brightnessPresets=[],this.scenePresets=[],this._dragActive=!1,this._dragValue=0,this._dragStartRow=-1,this._dragStartCol=-1,this._dragEndRow=-1,this._dragEndCol=-1,this._page=0,this._activePaletteIndex=1,this._nowMinutes=b._currentMinutes(),this._timeIndicatorLeft=null,this._mobileTimePos=null,this._isMobile=!1,this._mobileSelectedDayKey="",this._mobilePaintMode=!1,this._daysPerPage=56,this._tapTarget=null,this._tapStartX=0,this._tapStartY=0,this._timerHandle=null,this._mediaQuery=null,this._onMediaChange=t=>{this._isMobile=t.matches}}static _currentMinutes(){const t=new Date;return t.getHours()*60+t.getMinutes()}connectedCallback(){super.connectedCallback(),this._timerHandle=setInterval(()=>{this._nowMinutes=b._currentMinutes()},3e4),this._mediaQuery=window.matchMedia("(max-width: 768px)"),this._isMobile=this._mediaQuery.matches,this._mediaQuery.addEventListener("change",this._onMediaChange)}disconnectedCallback(){var t;super.disconnectedCallback(),this._timerHandle!==null&&(clearInterval(this._timerHandle),this._timerHandle=null),(t=this._mediaQuery)==null||t.removeEventListener("change",this._onMediaChange)}updated(t){super.updated(t),(t.has("_nowMinutes")||t.has("slots")||t.has("cadence")||t.has("_isMobile")||t.has("_mobileSelectedDayKey"))&&requestAnimationFrame(()=>this._updateTimeIndicatorPosition())}_updateTimeIndicatorPosition(){var a,l;if(this._isMobile){this._updateMobileTimeIndicator();return}const t=(a=this.shadowRoot)==null?void 0:a.querySelector(".grid"),e=(l=this.shadowRoot)==null?void 0:l.querySelector(".grid-wrapper");if(!t||!e)return;const s=Math.floor(this._nowMinutes/15),i=this._nowMinutes%15/15,o=t.querySelector(`[data-col="${s}"]`);if(!o)return;const r=e.getBoundingClientRect(),n=o.getBoundingClientRect();this._timeIndicatorLeft=n.left-r.left+n.width*i}_updateMobileTimeIndicator(){var u,m;const t=(u=this.shadowRoot)==null?void 0:u.querySelector(".mobile-grid"),e=(m=this.shadowRoot)==null?void 0:m.querySelector(".grid-wrapper");if(!t||!e){this._mobileTimePos=null;return}const s=this._effectiveMobileDay;if(!(this.cadence==="daily"||this._rowTemporalState(s)==="today")){this._mobileTimePos=null;return}const o=Math.floor(this._nowMinutes/15),r=this._nowMinutes%15/15,n=Math.floor(o/k),a=o%k,l=t.querySelector(`[data-row="${n}"][data-col="${a}"]`);if(!l){this._mobileTimePos=null;return}const d=e.getBoundingClientRect(),g=l.getBoundingClientRect();this._mobileTimePos={left:g.left-d.left+g.width*r,top:g.top-d.top,height:g.height}}get _allDayKeys(){return this.cadence==="daily"?["0"]:this.cadence==="weekly"?ye:this.customDates}get _dayKeys(){if(this.cadence==="daily")return["0"];if(this.cadence==="weekly")return ye;const t=this.customDates;if(t.length<=this._daysPerPage)return t;const e=this._page*this._daysPerPage;return t.slice(e,e+this._daysPerPage)}get _effectiveMobileDay(){const t=this._allDayKeys;return this._mobileSelectedDayKey&&t.includes(this._mobileSelectedDayKey)?this._mobileSelectedDayKey:t[0]||"0"}get _totalPages(){return this.cadence!=="custom"?1:Math.max(1,Math.ceil(this.customDates.length/this._daysPerPage))}_renderLabel(t){if(this.cadence!=="custom")return this._dayLabel(t);const e=new Date(t+"T00:00:00"),s=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][e.getDay()];return c`<span class="day-name">${s}</span><span class="day-date">${t}</span>`}_dayLabel(t){if(this.cadence==="daily")return"Every day";if(this.cadence==="weekly")return yt[parseInt(t)]??t;const e=new Date(t+"T00:00:00");return`${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][e.getDay()]} ${t}`}_mobileDayLabel(t){const e=this._dayLabel(t);return this._rowTemporalState(t)==="today"?`${e} (Today)`:e}render(){return this._isMobile?this._renderMobileLayout():this._renderDesktopLayout()}_renderDesktopLayout(){const t=this._dayKeys,e=Array.from({length:24},(i,o)=>o),s=this.slotType==="color"||this.slotType==="hvac"||this.slotType==="brightness"||this.slotType==="scene";return c`
      ${s?this._renderPaletteBar():p}
      <div class="toolbar">
        ${s?c`
              <button class="secondary" @click=${()=>this._bulkSet(this._activePaletteIndex)}>Fill All</button>
              <button class="secondary" @click=${()=>this._bulkSet(0)}>Clear All</button>
            `:c`
              <button class="secondary" @click=${()=>this._bulkSet(1)}>All On</button>
              <button class="secondary" @click=${()=>this._bulkSet(0)}>All Off</button>
            `}
        ${this.cadence==="weekly"?c`
              <button class="secondary" @click=${this._copyMondayToAll}>Copy Mon → All</button>
            `:p}
      </div>
      <div class="grid-container">
        <div class="grid-wrapper">
          ${this._renderTimeIndicator()}
          <div class="grid" @mouseup=${this._onMouseUp} @mouseleave=${this._onMouseUp}>
          <!-- hour headers -->
          <div class="header-spacer"></div>
          ${e.map(i=>c`
              <div class="header-cell" style="grid-column: span 4">${String(i).padStart(2,"0")}</div>
            `)}

          <!-- rows -->
          ${t.map((i,o)=>this._renderRow(i,o))}
          </div>
        </div>
      </div>
      ${this.cadence==="custom"&&this._totalPages>1?c`
            <div class="pagination">
              <button class="secondary" ?disabled=${this._page===0} @click=${this._prevPage}>
                ← Prev
              </button>
              <span>Page ${this._page+1} of ${this._totalPages}</span>
              <button
                class="secondary"
                ?disabled=${this._page>=this._totalPages-1}
                @click=${this._nextPage}
              >
                Next →
              </button>
            </div>
          `:p}
    `}_renderMobileLayout(){const t=this.slotType==="color"||this.slotType==="hvac"||this.slotType==="brightness"||this.slotType==="scene",e=this._allDayKeys,s=this._effectiveMobileDay,i=this.slots[s]??new Array(P).fill(0),o=this.cadence!=="daily",r=this.cadence==="daily"||this._rowTemporalState(s)==="today",n=[{label:"00 – 03",startHour:0},{label:"04 – 07",startHour:4},{label:"08 – 11",startHour:8},{label:"12 – 15",startHour:12},{label:"16 – 19",startHour:16},{label:"20 – 23",startHour:20}];return c`
      ${t?this._renderPaletteBar():p}
      <div class="toolbar">
        ${t?c`
              <button class="secondary" @click=${()=>this._bulkSet(this._activePaletteIndex)}>Fill All</button>
              <button class="secondary" @click=${()=>this._bulkSet(0)}>Clear All</button>
            `:c`
              <button class="secondary" @click=${()=>this._bulkSet(1)}>All On</button>
              <button class="secondary" @click=${()=>this._bulkSet(0)}>All Off</button>
            `}
        ${this.cadence==="weekly"?c`<button class="secondary" @click=${this._copyMondayToAll}>Copy Mon → All</button>`:p}
        <button class="secondary paint-toggle ${this._mobilePaintMode?"paint-active":""}"
                @click=${this._togglePaintMode}>
            ${this._mobilePaintMode?"Paint: ON":"Paint: OFF"}
        </button>
        ${o?c`
              <select class="day-select" .value=${s} @change=${this._onMobileDayChange}>
                ${e.map(a=>c`
                  <option value=${a} ?selected=${a===s}>${this._mobileDayLabel(a)}</option>
                `)}
              </select>
            `:p}
      </div>
      <div class="grid-container">
        <div class="grid-wrapper">
          ${this._renderMobileTimeIndicator()}
          <div class="mobile-grid ${this._mobilePaintMode?"paint-active":""}" @mouseup=${this._onMouseUp} @mouseleave=${this._onMouseUp}>
            ${n.map((a,l)=>{const d=l*k,g=Array.from({length:4},(u,m)=>a.startHour+m);return c`
                <div class="header-spacer"></div>
                ${g.map(u=>c`
                  <div class="header-cell" style="grid-column: span 4">${String(u).padStart(2,"0")}</div>
                `)}
                <div class="row-label ${r?"today-row":""}">${a.label}</div>
                ${Array.from({length:k},(u,m)=>{const E=d+m,T=i[E],zt=this._isInDragRegion(l,m),Nt=t?this._paletteCellStyle(T):"";return c`
                    <div
                      class="cell ${t?T?"color-set":"off":T?"on":"off"} ${r?"today-row":""} ${zt?"drag-preview":""} ${m%4===0?"hour-start":""}"
                      style=${Nt}
                      data-row=${l}
                      data-col=${m}
                      data-day=${s}
                      title="${this._cellTooltip(E,T)}"
                      @mousedown=${ee=>this._onMouseDown(ee,l,m,s)}
                      @mouseenter=${ee=>this._onMouseEnter(ee,l,m)}
                      @touchstart=${ee=>this._onTouchStart(ee,l,m,s)}
                      @touchmove=${this._onTouchMove}
                      @touchend=${this._onTouchEnd}
                    ></div>
                  `})}
              `})}
          </div>
        </div>
      </div>
    `}_onMobileDayChange(t){this._mobileSelectedDayKey=t.target.value}_togglePaintMode(){this._mobilePaintMode=!this._mobilePaintMode}_toggleSingleCell(t,e,s){const i=t*k+e;if(i>=P)return;const o=[...this.slots[s]??new Array(P).fill(0)];this.slotType==="color"||this.slotType==="hvac"||this.slotType==="brightness"||this.slotType==="scene"?o[i]=o[i]===this._activePaletteIndex?0:this._activePaletteIndex:o[i]=o[i]?0:1;const r={...this.slots,[s]:o};this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:r},bubbles:!0,composed:!0}))}_weekIndex(t){if(this.cadence!=="custom")return 0;const e=new Date(t+"T00:00:00"),s=this.customDates;if(s.length===0)return 0;const i=new Date(s[0]+"T00:00:00"),o=new Date(i);o.setDate(i.getDate()-i.getDay());const r=Math.floor((e.getTime()-o.getTime())/864e5);return Math.floor(r/7)}_rowTemporalState(t){const e=new Date;if(this.cadence==="weekly"){const s=String((e.getDay()+6)%7);return t===s?"today":"other"}if(this.cadence==="custom"){const s=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`;return t===s?"today":t<s?"past":"other"}return"other"}_renderRow(t,e){const s=this.slots[t]??new Array(P).fill(0),i=this.slotType==="color"||this.slotType==="hvac"||this.slotType==="brightness"||this.slotType==="scene",o=this.cadence==="custom"&&this._weekIndex(t)%2===1,r=this._rowTemporalState(t),n=r==="today",a=r==="past";return c`
      <div class="row-label ${o?"week-even":""} ${n?"today-row":""} ${a?"past-row":""}">${this._renderLabel(t)}</div>
      ${s.map((l,d)=>{const g=this._isInDragRegion(e,d),u=i?this._paletteCellStyle(l):"";return c`
          <div
            class="cell ${i?l?"color-set":"off":l?"on":"off"} ${o&&!l?"week-even":""} ${n?"today-row":""} ${a?"past-row":""} ${g?"drag-preview":""} ${d%4===0?"hour-start":""}"
            style=${u}
            data-row=${e}
            data-col=${d}
            data-day=${t}
            title="${this._cellTooltip(d,l)}"
            @mousedown=${m=>this._onMouseDown(m,e,d,t)}
            @mouseenter=${m=>this._onMouseEnter(m,e,d)}
            @touchstart=${m=>this._onTouchStart(m,e,d,t)}
            @touchmove=${this._onTouchMove}
            @touchend=${this._onTouchEnd}
          ></div>
        `})}
    `}_cellTooltip(t,e=0){const s=Math.floor(t*15/60),i=t*15%60,o=Math.floor((t+1)*15/60),r=(t+1)*15%60,n=`${String(s).padStart(2,"0")}:${String(i).padStart(2,"0")} – ${String(o).padStart(2,"0")}:${String(r).padStart(2,"0")}`;if(this.slotType==="hvac"&&e>0&&this.hvacPresets&&e<=this.hvacPresets.length){const a=this.hvacPresets[e-1],l=[n];return a.alias&&l.push(a.alias),a.temperature!==null&&l.push(`Temp: ${a.temperature}°C`),a.hvac_mode&&l.push(`Mode: ${a.hvac_mode}`),a.fan_mode&&l.push(`Fan: ${a.fan_mode}`),l.join(`
`)}if(this.slotType==="color"&&e>0&&this.palette&&e<=this.palette.length){const a=L(this.palette[e-1]);if(a.mode==="cycle"&&a.alias)return`${n}
${a.alias}`}if(this.slotType==="brightness"&&e>0&&this.brightnessPresets&&e<=this.brightnessPresets.length){const a=this.brightnessPresets[e-1],l=Math.round(a.brightness/255*100),d=a.alias||`${l}%`,g=a.transition==="crossfade"?" ⇢":"";return`${n}
${d}${g}`}if(this.slotType==="scene"&&e>0&&this.scenePresets&&e<=this.scenePresets.length){const a=this.scenePresets[e-1];return`${n}
${a.alias||a.name}`}return n}_paletteCellStyle(t){if(t===0)return"";if(this.slotType==="hvac")return!this.hvacPresets||t>this.hvacPresets.length?"":`background: ${this.hvacPresets[t-1].color}`;if(this.slotType==="brightness")return!this.brightnessPresets||t>this.brightnessPresets.length?"":`background: ${this.brightnessPresets[t-1].color}`;if(this.slotType==="scene")return!this.scenePresets||t>this.scenePresets.length?"":`background: ${this.scenePresets[t-1].color}`;if(!this.palette||t>this.palette.length)return"";const e=L(this.palette[t-1]);return`background: ${je(e)}`}_renderPaletteBar(){let t,e;this.slotType==="hvac"?(e=20,t=this.hvacPresets.map((o,r)=>({color:o.color,label:o.alias||this._hvacShortLabel(o),tooltip:this._hvacSwatchTooltip(o),icon:o.icon,index:r+1}))):this.slotType==="brightness"?(e=20,t=this.brightnessPresets.map((o,r)=>({color:o.color,label:`${o.alias||`${Math.round(o.brightness/255*100)}%`}${o.transition==="crossfade"?" ⇢":""}`,tooltip:`${o.alias||`${Math.round(o.brightness/255*100)}%`}${o.transition==="crossfade"?`
Cross-fade`:""}`,icon:o.icon,index:r+1,textColor:xt(o.color)}))):this.slotType==="scene"?(e=20,t=this.scenePresets.map((o,r)=>({color:o.color,label:o.alias||o.name,tooltip:`${o.alias||o.name}
${o.scene_id}`,icon:o.icon,index:r+1}))):(e=10,t=this.palette.map((o,r)=>{const n=L(o),a=n.mode==="crossfade"?"⇢":n.mode==="cycle"?"⟳":n.mode==="tv"?"📺":"",l=n.mode==="cycle"&&n.alias?n.alias:`${n.color} (${n.mode})`;return{color:je(n),label:l,tooltip:n.alias?`${n.alias}
${n.color} – ${n.mode}`:`${n.color} – ${n.mode}`,icon:a||void 0,index:r+1}}));const s=t.length>1,i=t.length<e;return c`
      <div class="palette-bar">
        <div
          class="palette-swatch eraser ${this._activePaletteIndex===0?"active":""}"
          title="Eraser"
          @click=${()=>{this._activePaletteIndex=0}}
        >✕</div>
        ${t.map(o=>c`
          <div
            class="palette-swatch ${this._activePaletteIndex===o.index?"active":""}"
            style="background: ${o.color}${o.textColor?`; color: ${o.textColor}`:""}"
            title="${o.tooltip}"
            @click=${()=>{this._activePaletteIndex=o.index}}
            @dblclick=${r=>{r.preventDefault(),this.dispatchEvent(new CustomEvent("preset-edit",{detail:{index:o.index-1}}))}}
          >${c`<button class="swatch-edit" @click=${r=>{r.stopPropagation(),this.dispatchEvent(new CustomEvent("preset-edit",{detail:{index:o.index-1}}))}}>✏</button>`}${o.icon?c`<mdi-icon .icon=${o.icon} style="--mdi-icon-size:16px"></mdi-icon>`:""}${s?c`<button class="swatch-remove" @click=${r=>{r.stopPropagation(),this.dispatchEvent(new CustomEvent("preset-delete",{detail:{index:o.index-1}}))}}>✕</button>`:""}</div>
        `)}
        ${i?c`
          <div
            class="palette-swatch palette-swatch-add"
            title="Add preset"
            @click=${()=>{this.dispatchEvent(new CustomEvent("preset-add"))}}
          >+</div>
        `:""}
      </div>
    `}_hvacShortLabel(t){const e=[];return t.temperature!==null&&e.push(`${t.temperature}°`),t.hvac_mode&&e.push(t.hvac_mode),t.fan_mode&&e.push(t.fan_mode),e.join(" | ")||"Preset"}_hvacSwatchTooltip(t){const e=[];return t.alias&&e.push(t.alias),t.temperature!==null&&e.push(`Temp: ${t.temperature}°C`),t.hvac_mode&&e.push(`Mode: ${t.hvac_mode}`),t.fan_mode&&e.push(`Fan: ${t.fan_mode}`),e.join(`
`)}_renderTimeIndicator(){if(this._timeIndicatorLeft===null)return p;const t=Math.floor(this._nowMinutes/60),e=this._nowMinutes%60,s=`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`,i=`${this._timeIndicatorLeft}px`;return c`
      <span class="time-label top" style="left: ${i}">${s}</span>
      <div class="time-indicator" style="left: ${i}"></div>
      <span class="time-label bottom" style="left: ${i}">${s}</span>
    `}_renderMobileTimeIndicator(){if(!this._mobileTimePos)return p;const t=Math.floor(this._nowMinutes/60),e=this._nowMinutes%60,s=`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`,{left:i,top:o,height:r}=this._mobileTimePos;return c`
      <span class="time-label" style="left: ${i}px; top: ${o}px; transform: translate(-50%, -100%)">${s}</span>
      <div class="time-indicator" style="left: ${i}px; top: ${o}px; height: ${r}px; bottom: auto"></div>
    `}_isInDragRegion(t,e){if(!this._dragActive)return!1;const s=Math.min(this._dragStartRow,this._dragEndRow),i=Math.max(this._dragStartRow,this._dragEndRow),o=Math.min(this._dragStartCol,this._dragEndCol),r=Math.max(this._dragStartCol,this._dragEndCol);return t>=s&&t<=i&&e>=o&&e<=r}_onMouseDown(t,e,s,i){t.preventDefault();const o=this.slots[i]??new Array(P).fill(0),r=this._isMobile?e*k+s:s;this.slotType==="color"||this.slotType==="hvac"||this.slotType==="brightness"||this.slotType==="scene"?this._dragValue=o[r]===this._activePaletteIndex?0:this._activePaletteIndex:this._dragValue=o[r]?0:1,this._dragStartRow=e,this._dragStartCol=s,this._dragEndRow=e,this._dragEndCol=s,this._dragActive=!0}_onMouseEnter(t,e,s){this._dragActive&&(this._dragEndRow=e,this._dragEndCol=s)}_onMouseUp(){this._dragActive&&(this._applyDrag(),this._dragActive=!1)}_onTouchStart(t,e,s,i){if(this._isMobile&&!this._mobilePaintMode){const n=t.touches[0];this._tapTarget={row:e,col:s,dayKey:i},this._tapStartX=n.clientX,this._tapStartY=n.clientY;return}t.preventDefault();const o=this.slots[i]??new Array(P).fill(0),r=this._isMobile?e*k+s:s;this.slotType==="color"||this.slotType==="hvac"||this.slotType==="brightness"||this.slotType==="scene"?this._dragValue=o[r]===this._activePaletteIndex?0:this._activePaletteIndex:this._dragValue=o[r]?0:1,this._dragStartRow=e,this._dragStartCol=s,this._dragEndRow=e,this._dragEndCol=s,this._dragActive=!0}_onTouchMove(t){var i;if(this._isMobile&&!this._mobilePaintMode){if(this._tapTarget){const o=t.touches[0],r=Math.abs(o.clientX-this._tapStartX),n=Math.abs(o.clientY-this._tapStartY);(r>10||n>10)&&(this._tapTarget=null)}return}if(!this._dragActive)return;const e=t.touches[0],s=(i=this.shadowRoot)==null?void 0:i.elementFromPoint(e.clientX,e.clientY);(s==null?void 0:s.dataset.row)!==void 0&&(s==null?void 0:s.dataset.col)!==void 0&&(this._dragEndRow=parseInt(s.dataset.row),this._dragEndCol=parseInt(s.dataset.col))}_onTouchEnd(){if(this._isMobile&&!this._mobilePaintMode){this._tapTarget&&(this._toggleSingleCell(this._tapTarget.row,this._tapTarget.col,this._tapTarget.dayKey),this._tapTarget=null);return}this._dragActive&&(this._applyDrag(),this._dragActive=!1)}_applyDrag(){const t=Math.min(this._dragStartRow,this._dragEndRow),e=Math.max(this._dragStartRow,this._dragEndRow),s=Math.min(this._dragStartCol,this._dragEndCol),i=Math.max(this._dragStartCol,this._dragEndCol),o={...this.slots};if(this._isMobile){const r=this._effectiveMobileDay,n=[...o[r]??new Array(P).fill(0)];for(let a=t;a<=e;a++)for(let l=s;l<=i;l++){const d=a*k+l;d<P&&(n[d]=this._dragValue)}o[r]=n}else{const r=this._dayKeys;for(let n=t;n<=e;n++){const a=r[n];if(!a)continue;const l=[...o[a]??new Array(P).fill(0)];for(let d=s;d<=i;d++)l[d]=this._dragValue;o[a]=l}}this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:o},bubbles:!0,composed:!0}))}_bulkSet(t){const e=this.cadence==="custom"?this.customDates:this._dayKeys,s={};for(const i of e)s[i]=new Array(P).fill(t);this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:s},bubbles:!0,composed:!0}))}_copyMondayToAll(){const t=this.slots[0]??new Array(P).fill(0),e={};for(const s of ye)e[s]=[...t];this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:e},bubbles:!0,composed:!0}))}_prevPage(){this._page=Math.max(0,this._page-1)}_nextPage(){this._page=Math.min(this._totalPages-1,this._page+1)}};b.styles=[U,D`
      :host {
        display: block;
        --_grid-bg: var(--ha-card-background, var(--card-background-color, var(--primary-background-color, #fafafa)));
      }
      .grid-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding-top: 18px;
        padding-bottom: 18px;
        background: var(--_grid-bg);
      }
      .toolbar {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
        flex-wrap: wrap;
        align-items: center;
      }
      .toolbar button {
        font-size: 12px;
        padding: 4px 10px;
      }
      .grid {
        display: grid;
        grid-template-columns: 130px repeat(${P}, minmax(var(--ss-cell-size), 1fr));
        gap: 1px;
        user-select: none;
        -webkit-user-select: none;
      }
      .header-cell {
        font-size: 10px;
        text-align: center;
        color: var(--secondary-text-color, #727272);
        height: 20px;
        line-height: 20px;
      }
      .header-spacer {
        grid-column: 1;
        position: sticky;
        left: 0;
        z-index: 2;
        background: var(--_grid-bg);
      }
      .row-label {
        font-size: 12px;
        font-weight: 500;
        line-height: var(--ss-cell-size);
        padding-right: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
        position: sticky;
        left: 0;
        z-index: 2;
        background: var(--_grid-bg);
      }
      .row-label .day-name {
        flex-shrink: 0;
      }
      .row-label .day-date {
        color: var(--secondary-text-color, #727272);
        font-weight: 400;
      }
      .row-label.week-even {
        background: color-mix(in srgb, var(--ss-primary) 6%, var(--_grid-bg));
      }
      .row-label.today-row {
        background: color-mix(in srgb, var(--warning-color, #ff9800) 18%, var(--_grid-bg));
        font-weight: 700;
      }
      .row-label.past-row {
        opacity: 0.4;
      }
      .cell {
        aspect-ratio: 1;
        min-width: var(--ss-cell-size);
        min-height: var(--ss-cell-size);
        border-radius: 2px;
        cursor: pointer;
        transition: background 0.1s;
        box-sizing: border-box;
      }
      .cell.on {
        background: var(--ss-cell-on);
      }
      .cell.off {
        background: var(--ss-cell-off);
        border: 1px solid var(--divider-color, #e0e0e0);
      }
      .cell.off.week-even {
        background: color-mix(in srgb, var(--ss-primary) 6%, var(--ss-cell-off));
      }
      .cell.today-row.on {
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--warning-color, #ff9800) 40%, transparent);
      }
      .cell.today-row.off {
        background: color-mix(in srgb, var(--warning-color, #ff9800) 12%, var(--ss-cell-off));
        border-color: color-mix(in srgb, var(--warning-color, #ff9800) 30%, var(--divider-color, #e0e0e0));
      }
      .cell.past-row {
        opacity: 0.4;
      }
      .cell.color-set {
        border: 1px solid rgba(0, 0, 0, 0.15);
      }
      .cell.hour-start {
        border-left: 2px solid var(--warning-color, #ff9800);
      }
      .cell.drag-preview {
        outline: 2px solid var(--ss-primary);
        outline-offset: -1px;
      }
      .pagination {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
        justify-content: center;
      }
      .pagination button {
        font-size: 12px;
        padding: 4px 10px;
      }
      .pagination span {
        font-size: 13px;
        color: var(--secondary-text-color, #727272);
      }
      .palette-bar {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 8px;
        flex-wrap: wrap;
      }
      .palette-bar span {
        font-size: 12px;
        color: var(--secondary-text-color, #727272);
        margin-right: 2px;
      }
      .palette-swatch {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
        border: 2px solid transparent;
        box-sizing: border-box;
        transition: border-color 0.15s, transform 0.1s;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        position: relative;
      }
      .palette-swatch:hover {
        transform: scale(1.15);
      }
      .palette-swatch.active {
        border-color: var(--primary-text-color, #212121);
        box-shadow: 0 0 0 1px var(--ss-bg);
      }
      .palette-swatch.eraser {
        background: var(--ss-cell-off);
        border-color: var(--ss-border);
        position: relative;
      }
      .palette-swatch.eraser.active {
        border-color: var(--primary-text-color, #212121);
      }
      .palette-swatch .swatch-remove {
        display: none;
        position: absolute;
        top: -6px;
        right: -6px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: none;
        background: var(--error-color, #db4437);
        color: #fff;
        font-size: 9px;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
      }
      .palette-swatch:hover .swatch-remove {
        display: flex;
      }
      .palette-swatch .swatch-edit {
        display: none;
        position: absolute;
        top: -6px;
        left: -6px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: none;
        background: var(--primary-color, #03a9f4);
        color: #fff;
        font-size: 8px;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
      }
      .palette-swatch:hover .swatch-edit {
        display: flex;
      }
      .palette-swatch-add {
        background: var(--ss-cell-off, #e0e0e0);
        border-color: var(--ss-border, #ccc);
        color: var(--secondary-text-color, #727272);
        font-size: 16px;
        font-weight: bold;
      }
      .palette-swatch-add:hover {
        background: var(--ss-border, #ccc);
      }
      .grid-wrapper {
        position: relative;
      }
      .time-indicator {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 0;
        border-left: 2px dashed var(--error-color, #db4437);
        z-index: 3;
        pointer-events: none;
      }
      .time-label {
        position: absolute;
        font-size: 10px;
        font-weight: 600;
        color: var(--error-color, #db4437);
        white-space: nowrap;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: 4;
      }
      .time-label.top {
        top: 0;
        transform: translate(-50%, -100%);
      }
      .time-label.bottom {
        bottom: 0;
        transform: translate(-50%, calc(100% + 4px));
      }
      /* ── Mobile layout ── */
      .day-select {
        flex: 1;
        min-width: 120px;
      }
      .mobile-grid {
        display: grid;
        grid-template-columns: 64px repeat(${k}, 1fr);
        gap: 1px;
        user-select: none;
        -webkit-user-select: none;
      }
      .mobile-grid .cell {
        aspect-ratio: 1;
        min-width: 0;
        min-height: 0;
      }
      .mobile-grid .header-cell {
        font-size: 9px;
        height: 16px;
        line-height: 16px;
      }
      .mobile-grid .row-label {
        font-size: 11px;
        padding-right: 4px;
        position: static;
        display: flex;
        align-items: center;
      }
      .mobile-grid .header-spacer {
        position: static;
      }
      .paint-toggle {
        transition: background 0.15s;
      }
      .paint-toggle.paint-active {
        background: var(--ss-primary);
        color: #fff;
      }
      .mobile-grid.paint-active {
        outline: 2px solid var(--ss-primary);
        outline-offset: 2px;
        border-radius: 4px;
      }
    `],y([v({type:String})],b.prototype,"cadence",2),y([v({type:Object})],b.prototype,"slots",2),y([v({type:Array})],b.prototype,"customDates",2),y([v({type:String})],b.prototype,"slotType",2),y([v({type:Array})],b.prototype,"palette",2),y([v({type:Array})],b.prototype,"hvacPresets",2),y([v({type:Array})],b.prototype,"brightnessPresets",2),y([v({type:Array})],b.prototype,"scenePresets",2),y([h()],b.prototype,"_dragActive",2),y([h()],b.prototype,"_dragValue",2),y([h()],b.prototype,"_dragStartRow",2),y([h()],b.prototype,"_dragStartCol",2),y([h()],b.prototype,"_dragEndRow",2),y([h()],b.prototype,"_dragEndCol",2),y([h()],b.prototype,"_page",2),y([h()],b.prototype,"_activePaletteIndex",2),y([h()],b.prototype,"_nowMinutes",2),y([h()],b.prototype,"_timeIndicatorLeft",2),y([h()],b.prototype,"_mobileTimePos",2),y([h()],b.prototype,"_isMobile",2),y([h()],b.prototype,"_mobileSelectedDayKey",2),y([h()],b.prototype,"_mobilePaintMode",2),b=y([I("schedule-grid")],b);var $t=Object.defineProperty,wt=Object.getOwnPropertyDescriptor,C=(t,e,s,i)=>{for(var o=i>1?void 0:i?wt(e,s):e,r=t.length-1,n;r>=0;r--)(n=t[r])&&(o=(i?n(e,s,o):n(o))||o);return i&&o&&$t(e,s,o),o};const Be=["switch","light","fan","input_boolean","climate"],Pt=["rgb","rgbw","rgbww","hs","xy"],St={switch:{on:"M17 7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h10a5 5 0 0 0 5-5 5 5 0 0 0-5-5m0 8a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3Z",off:"M17 7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h10a5 5 0 0 0 5-5 5 5 0 0 0-5-5M7 15a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3Z"},light:{on:"M12 6a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 0 1 6-6m2 15v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1h4m-3-5h2l.5-4h-3l.5 4Z",off:"M12 6a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 0 1 6-6m2 15v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1h4M12 8a4 4 0 0 0-4 4c0 1.54.83 2.87 2.07 3.6l.43.25V18h3v-2.15l.43-.25A4.02 4.02 0 0 0 16 12a4 4 0 0 0-4-4Z"},fan:{on:"M12 11a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1m4.22-.99c-.67.49-1.47.86-2.23 1.12.03.31-.02.63-.14.93 1.59 1.08 2.75 2.59 2.75 3.2 0 .43-.55.86-1.5 1.18-.96.32-2.2.5-3.5.56-.45-.6-1.07-1.08-1.74-1.42.03-.77.13-1.51.31-2.2-.52-.36-.9-.87-1.1-1.45A9.82 9.82 0 0 1 5 12.83c0-.72.53-1.35 1.42-1.82.89-.47 2.05-.77 3.34-.89.4.55.94.97 1.56 1.2.44-.66.97-1.26 1.59-1.77-.29-.47-.42-1.01-.39-1.55A9.73 9.73 0 0 1 12 4.29c.72 0 1.35.53 1.82 1.42.47.89.77 2.05.89 3.34a3.43 3.43 0 0 0-1.2 1.56c.65.43 1.24.96 1.75 1.58.48-.29 1.02-.43 1.56-.4.84.19 1.64.46 2.36.83.72.37 1.19.93 1.19 1.55 0 .72-.53 1.35-1.42 1.82-.89.47-2.05.77-3.34.89a3.43 3.43 0 0 0-1.2-1.56Z",off:"M12 11a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1m4.22-.99c-.67.49-1.47.86-2.23 1.12.03.31-.02.63-.14.93 1.59 1.08 2.75 2.59 2.75 3.2 0 .43-.55.86-1.5 1.18-.96.32-2.2.5-3.5.56-.45-.6-1.07-1.08-1.74-1.42.03-.77.13-1.51.31-2.2-.52-.36-.9-.87-1.1-1.45A9.82 9.82 0 0 1 5 12.83c0-.72.53-1.35 1.42-1.82.89-.47 2.05-.77 3.34-.89.4.55.94.97 1.56 1.2.44-.66.97-1.26 1.59-1.77-.29-.47-.42-1.01-.39-1.55A9.73 9.73 0 0 1 12 4.29c.72 0 1.35.53 1.82 1.42.47.89.77 2.05.89 3.34a3.43 3.43 0 0 0-1.2 1.56c.65.43 1.24.96 1.75 1.58.48-.29 1.02-.43 1.56-.4.84.19 1.64.46 2.36.83.72.37 1.19.93 1.19 1.55 0 .72-.53 1.35-1.42 1.82-.89.47-2.05.77-3.34.89a3.43 3.43 0 0 0-1.2-1.56Z"},cover:{on:"M3 4h18v2H3V4m0 14h18v2H3v-2m0-7h18v2H3v-2m0 3.5h18v1H3v-1m0-7h18v1H3v-1Z",off:"M3 4h18v2H3V4m0 14h18v2H3v-2Z"},climate:{on:"M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-8a1 1 0 0 1 1 1v3h-2V6a1 1 0 0 1 1-1Z",off:"M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-8a1 1 0 0 1 1 1v3h-2V6a1 1 0 0 1 1-1Z"},input_boolean:{on:"M17 7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h10a5 5 0 0 0 5-5 5 5 0 0 0-5-5m0 8a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3Z",off:"M17 7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h10a5 5 0 0 0 5-5 5 5 0 0 0-5-5M7 15a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3Z"}},Et="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4c-1.1 0-2 .9-2 2v3.8h1.5c1.4 0 2.5 1.1 2.5 2.5S4.9 15.8 3.5 15.8H2V19c0 1.1.9 2 2 2h3.8v-1.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5V21H17c1.1 0 2-.9 2-2v-4h1.5a2.5 2.5 0 0 0 0-5Z";let S=class extends w{constructor(){super(...arguments),this.slotType="on_off",this.selectedIds=[],this.overrides={},this.scheduledStates={},this.unavailableEntities=[],this.showOverrides=!1,this._query="",this._open=!1}_isEntityCompatible(t){var s,i,o,r;const e=t.split(".")[0];if(this.slotType==="color"){if(e!=="light")return!1;const n=(r=(o=(i=(s=this.hass)==null?void 0:s.states)==null?void 0:i[t])==null?void 0:o.attributes)==null?void 0:r.supported_color_modes;return Array.isArray(n)&&n.some(a=>Pt.includes(a))}return this.slotType==="hvac"?e==="climate":this.slotType==="brightness"?e==="light"||e==="fan":(this.slotType==="scene",Be.includes(e))}_incompatibleReason(t){const e=t.split(".")[0],s=e.replace("_"," ");return this.slotType==="color"?e!=="light"?`${s} does not support colour`:"light does not support colour modes":this.slotType==="hvac"?`${s} does not support HVAC states`:this.slotType==="brightness"?`${s} does not support brightness`:"incompatible"}get _availableEntities(){var e;if(!((e=this.hass)!=null&&e.states))return[];const t=new Set(this.selectedIds);return Object.keys(this.hass.states).filter(s=>t.has(s)?!1:this._isEntityCompatible(s)).map(s=>{var i,o;return{id:s,name:((o=(i=this.hass.states[s])==null?void 0:i.attributes)==null?void 0:o.friendly_name)??s}}).sort((s,i)=>s.id.localeCompare(i.id))}get _filtered(){const t=this._query.toLowerCase();return t?this._availableEntities.filter(e=>e.id.toLowerCase().includes(t)||e.name.toLowerCase().includes(t)):this._availableEntities}render(){return c`
      <div class="entity-list">
        ${this.selectedIds.map(t=>this._renderEntityRow(t))}
      </div>
      <div class="input-wrapper">
        <input
          type="text"
          .value=${this._query}
          @input=${this._onInput}
          @focus=${()=>{this._open=!0}}
          @blur=${this._onBlur}
          placeholder="Search entities..."
        />
        ${this._open?this._renderDropdown():p}
      </div>
    `}_renderEntityRow(t){var d,g,u;const e=this.overrides[t],s=this.scheduledStates[t],i=((u=(g=(d=this.hass)==null?void 0:d.states)==null?void 0:g[t])==null?void 0:u.state)==="on"?"on":"off",o=this.unavailableEntities.includes(t),r=!o&&!this._isEntityCompatible(t);let n="";o?n="unavailable":r?n="incompatible":this.showOverrides&&e&&(n=e===s?"override-match":"override-conflict");const a=e==="on"?"active-on":!e&&this.showOverrides&&i==="on"?"current-state":"",l=e==="off"?"active-off":!e&&this.showOverrides&&i==="off"?"current-state":"";return c`
      <div class="entity-row ${n}">
        <span class="entity-name">
          ${this._renderEntityIcon(t)}
          ${this._friendlyName(t)}
          <span class="entity-id">${t}</span>
        </span>
        ${o?c`<span class="unavailable-badge">unavailable</span>`:p}
        ${r?c`<span class="incompatible-badge" title=${this._incompatibleReason(t)}>${this._incompatibleReason(t)}</span>`:p}
        ${this.showOverrides&&this.slotType!=="color"&&this.slotType!=="brightness"&&this.slotType!=="scene"?c`
          <span class="override-controls">
            <button
              class="override-btn ${a}"
              title="Override On"
              @click=${()=>this._onOverride(t,"on")}
            >On</button>
            <button
              class="override-btn ${l}"
              title="Override Off"
              @click=${()=>this._onOverride(t,"off")}
            >Off</button>
          </span>
        `:p}
        <button class="entity-remove" @click=${()=>this._remove(t)}>✕</button>
      </div>
    `}_renderDropdown(){const t=this._filtered;return t.length===0?c`<div class="dropdown"><div class="no-results">No matching entities</div></div>`:c`
      <div class="dropdown">
        ${t.map(e=>c`
            <div class="option" @mousedown=${s=>{s.preventDefault(),this._select(e.id)}}>
              <span class="option-id">${e.id}</span>
              <span class="option-name">${e.name}</span>
            </div>
          `)}
      </div>
    `}_friendlyName(t){var e,s,i,o;return((o=(i=(s=(e=this.hass)==null?void 0:e.states)==null?void 0:s[t])==null?void 0:i.attributes)==null?void 0:o.friendly_name)??t}_entityIcon(t){var n,a,l;const e=t.split(".")[0],s=(a=(n=this.hass)==null?void 0:n.states)==null?void 0:a[t],i=(l=s==null?void 0:s.attributes)==null?void 0:l.icon;if(i)return i;const o=(s==null?void 0:s.state)==="on",r=St[e];return r?o?r.on:r.off:Et}_renderEntityIcon(t){var n,a,l;const e=(a=(n=this.hass)==null?void 0:n.states)==null?void 0:a[t],s=(l=e==null?void 0:e.attributes)==null?void 0:l.icon;if(s)return c`<mdi-icon class="entity-icon" .icon=${s} style="--mdi-icon-size: 18px"></mdi-icon>`;const i=e==null?void 0:e.state,o=i==="unavailable"||i==="unknown"?"state-unavailable":i==="on"?"state-on":"state-off",r=this._entityIcon(t);return c`<svg class="entity-icon ${o}" viewBox="0 0 24 24"><path d=${r}/></svg>`}_onInput(t){this._query=t.target.value,this._open=!0}_onBlur(){setTimeout(()=>{this._open=!1},150)}_select(t){const e=[...this.selectedIds,t];this._query="",this._fireChanged(e)}_remove(t){const e=this.selectedIds.filter(s=>s!==t);this._fireChanged(e)}_onOverride(t,e){this.overrides[t]===e?this.dispatchEvent(new CustomEvent("override-clear",{detail:{entityId:t},bubbles:!0,composed:!0})):this.dispatchEvent(new CustomEvent("override-set",{detail:{entityId:t,state:e},bubbles:!0,composed:!0}))}_fireChanged(t){this.dispatchEvent(new CustomEvent("entities-changed",{detail:{entityIds:t},bubbles:!0,composed:!0}))}};S.styles=[U,D`
      :host {
        display: block;
      }
      .entity-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 8px;
      }
      .entity-row {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 13px;
        background: color-mix(in srgb, var(--ss-primary) 10%, transparent);
        border: 1px solid transparent;
      }
      .entity-row.override-match {
        background: color-mix(in srgb, var(--warning-color, #ff9800) 20%, transparent);
        border-color: var(--warning-color, #ff9800);
      }
      .entity-row.override-conflict {
        background: color-mix(in srgb, var(--error-color, #db4437) 15%, transparent);
        border-color: var(--error-color, #db4437);
      }
      .entity-row.unavailable {
        background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
        border-color: var(--error-color, #db4437);
        opacity: 0.8;
      }
      .entity-row.incompatible {
        background: color-mix(in srgb, var(--warning-color, #ff9800) 10%, transparent);
        border-color: var(--warning-color, #ff9800);
        opacity: 0.85;
      }
      .incompatible-badge {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--warning-color, #ff9800);
        background: color-mix(in srgb, var(--warning-color, #ff9800) 15%, transparent);
        padding: 1px 6px;
        border-radius: 4px;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .unavailable-badge {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--error-color, #db4437);
        background: color-mix(in srgb, var(--error-color, #db4437) 15%, transparent);
        padding: 1px 6px;
        border-radius: 4px;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .entity-name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .entity-name .entity-icon {
        flex-shrink: 0;
        width: 18px;
        height: 18px;
      }
      .entity-name .entity-icon.state-on {
        fill: var(--primary-color, #03a9f4);
      }
      .entity-name .entity-icon.state-off {
        fill: var(--secondary-text-color, #727272);
      }
      .entity-name .entity-icon.state-unavailable {
        fill: var(--error-color, #db4437);
      }
      .entity-id {
        font-size: 11px;
        color: var(--secondary-text-color, #727272);
      }
      .override-controls {
        display: inline-flex;
        gap: 2px;
        flex-shrink: 0;
      }
      .override-btn {
        cursor: pointer;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 11px;
        background: transparent;
        color: var(--secondary-text-color, #727272);
        line-height: 1.3;
      }
      .override-btn:hover {
        background: var(--secondary-background-color, #f5f5f5);
      }
      .override-btn.active-on {
        background: var(--success-color, #4caf50);
        color: #fff;
        border-color: var(--success-color, #4caf50);
      }
      .override-btn.active-off {
        background: var(--error-color, #db4437);
        color: #fff;
        border-color: var(--error-color, #db4437);
      }
      .override-btn.current-state {
        background: color-mix(in srgb, var(--ss-primary) 20%, transparent);
        border-color: var(--ss-primary);
        color: var(--primary-text-color, #212121);
      }
      .entity-remove {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: transparent;
        border: none;
        color: var(--secondary-text-color, #727272);
        font-size: 14px;
        padding: 0;
        line-height: 1;
        flex-shrink: 0;
      }
      .entity-remove:hover {
        background: rgba(0, 0, 0, 0.1);
        color: var(--error-color, #db4437);
      }
      .input-wrapper {
        position: relative;
      }
      input {
        width: 100%;
      }
      .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        max-height: 200px;
        overflow-y: auto;
        background: var(--ss-bg);
        border: 1px solid var(--ss-border);
        border-top: none;
        border-radius: 0 0 4px 4px;
        z-index: 20;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }
      .option {
        padding: 8px 12px;
        cursor: pointer;
        font-size: 13px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .option:hover {
        background: var(--ss-cell-off);
      }
      .option-id {
        font-weight: 500;
      }
      .option-name {
        color: var(--secondary-text-color, #727272);
        font-size: 12px;
      }
      .no-results {
        padding: 8px 12px;
        color: var(--secondary-text-color, #727272);
        font-size: 13px;
        font-style: italic;
      }
    `],C([v({attribute:!1})],S.prototype,"hass",2),C([v({type:String})],S.prototype,"slotType",2),C([v({type:Array})],S.prototype,"selectedIds",2),C([v({type:Object})],S.prototype,"overrides",2),C([v({type:Object})],S.prototype,"scheduledStates",2),C([v({type:Array})],S.prototype,"unavailableEntities",2),C([v({type:Boolean})],S.prototype,"showOverrides",2),C([h()],S.prototype,"_query",2),C([h()],S.prototype,"_open",2),S=C([I("entity-picker")],S);var Ct=Object.defineProperty,Dt=Object.getOwnPropertyDescriptor,ne=(t,e,s,i)=>{for(var o=i>1?void 0:i?Dt(e,s):e,r=t.length-1,n;r>=0;r--)(n=t[r])&&(o=(i?n(e,s,o):n(o))||o);return i&&o&&Ct(e,s,o),o};const Ue=["mdi:thermometer","mdi:thermometer-high","mdi:thermometer-low","mdi:thermometer-lines","mdi:thermometer-chevron-up","mdi:thermometer-chevron-down","mdi:snowflake","mdi:snowflake-alert","mdi:snowflake-variant","mdi:fire","mdi:fire-alert","mdi:fan","mdi:fan-off","mdi:fan-speed-1","mdi:fan-speed-2","mdi:fan-speed-3","mdi:air-conditioner","mdi:air-filter","mdi:heat-wave","mdi:heat-pump","mdi:heat-pump-outline","mdi:coolant-temperature","mdi:hvac","mdi:weather-sunny","mdi:weather-night","mdi:weather-partly-cloudy","mdi:sun-thermometer","mdi:sun-thermometer-outline","mdi:home-thermometer","mdi:home-thermometer-outline","mdi:water-percent","mdi:water","mdi:water-off","mdi:waves","mdi:weather-windy","mdi:sun-snowflake-variant","mdi:power","mdi:power-off","mdi:power-plug","mdi:power-plug-off","mdi:flash","mdi:flash-off","mdi:lightning-bolt","mdi:battery","mdi:battery-charging","mdi:solar-power","mdi:solar-panel","mdi:clock","mdi:clock-outline","mdi:timer","mdi:timer-outline","mdi:calendar","mdi:calendar-clock","mdi:weather-sunset-up","mdi:weather-sunset-down","mdi:moon-waning-crescent","mdi:moon-full","mdi:home","mdi:home-outline","mdi:bed","mdi:bed-outline","mdi:sofa","mdi:desk","mdi:door","mdi:door-open","mdi:window-open","mdi:window-closed","mdi:garage","mdi:office-building","mdi:lightbulb","mdi:lightbulb-outline","mdi:lightbulb-off","mdi:lamp","mdi:ceiling-light","mdi:floor-lamp","mdi:led-strip","mdi:led-strip-variant","mdi:check","mdi:close","mdi:alert","mdi:information","mdi:cog","mdi:tune","mdi:wrench","mdi:leaf","mdi:tree","mdi:flower","mdi:account","mdi:account-group","mdi:star","mdi:heart","mdi:bell","mdi:eye","mdi:eye-off","mdi:lock","mdi:lock-open","mdi:shield","mdi:shield-check","mdi:volume-high","mdi:volume-off","mdi:wifi","mdi:bluetooth","mdi:car","mdi:walk","mdi:bike"];let F=class extends w{constructor(){super(...arguments),this.value="",this._query="",this._open=!1,this._onDocClick=t=>{this._open&&!this.renderRoot.contains(t.target)&&!this.contains(t.target)&&(this._open=!1)}}get _filtered(){const t=this._query.toLowerCase().replace(/^mdi:/,"");return t?Ue.filter(e=>e.toLowerCase().includes(t)):Ue}render(){return c`
      <div class="picker-input">
        ${this.value?c`<div class="current-icon"><mdi-icon .icon=${this.value}></mdi-icon></div>`:p}
        <input
          type="text"
          .value=${this._open?this._query:this.value||""}
          placeholder="Type to search icons…"
          @focus=${this._onFocus}
          @input=${this._onInput}
          @keydown=${this._onKeydown}
        />
        ${this.value?c`
          <button class="clear-btn" title="Clear icon" @click=${this._clear}>✕</button>
        `:p}
      </div>
      ${this._open?this._renderDropdown():p}
    `}_renderDropdown(){const t=this._filtered;return c`
      <div class="dropdown">
        ${t.length?t.map(e=>c`
              <div class="icon-option" @mousedown=${s=>{s.preventDefault(),this._select(e)}}>
                <mdi-icon .icon=${e}></mdi-icon>
                <span class="icon-name">${e.replace("mdi:","")}</span>
              </div>
            `):c`<div class="no-results">
                ${this._query?c`No matches. Press Enter to use "<b>${this._query.startsWith("mdi:")?this._query:"mdi:"+this._query}</b>"`:"Type to search…"}
              </div>`}
      </div>
    `}_onFocus(){this._query=this.value||"",this._open=!0}_onInput(t){this._query=t.target.value,this._open||(this._open=!0)}_onKeydown(t){if(t.key==="Escape")this._open=!1,t.target.blur();else if(t.key==="Enter"){t.preventDefault();const e=this._filtered;if(e.length===1)this._select(e[0]);else if(this._query){const s=this._query.startsWith("mdi:")?this._query:`mdi:${this._query}`;this._select(s)}}}_select(t){this._open=!1,this._query="",this._fireChange(t)}_clear(){this._open=!1,this._query="",this._fireChange("")}_fireChange(t){this.dispatchEvent(new CustomEvent("icon-changed",{detail:{icon:t},bubbles:!0,composed:!0}))}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this._onDocClick)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._onDocClick)}};F.styles=[U,D`
      :host { display: block; position: relative; }
      .picker-input {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .picker-input input {
        flex: 1;
        min-width: 0;
      }
      .current-icon {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-text-color, #212121);
      }
      .clear-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 2px;
        font-size: 14px;
        color: var(--secondary-text-color, #727272);
        line-height: 1;
      }
      .clear-btn:hover { color: var(--error-color, #db4437); }
      .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        max-height: 240px;
        overflow-y: auto;
        background: var(--ss-bg);
        border: 1px solid var(--ss-border);
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 20;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 2px;
        padding: 4px;
      }
      .icon-option {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        color: var(--primary-text-color, #212121);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .icon-option:hover {
        background: color-mix(in srgb, var(--ss-primary) 15%, transparent);
      }
      .icon-option mdi-icon {
        --mdi-icon-size: 20px;
        flex-shrink: 0;
      }
      .icon-option .icon-name {
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .no-results {
        padding: 12px;
        text-align: center;
        color: var(--secondary-text-color, #727272);
        font-size: 13px;
        grid-column: 1 / -1;
      }
    `],ne([v({type:String})],F.prototype,"value",2),ne([h()],F.prototype,"_query",2),ne([h()],F.prototype,"_open",2),F=ne([I("icon-picker")],F);var kt=Object.defineProperty,Tt=Object.getOwnPropertyDescriptor,ae=(t,e,s,i)=>{for(var o=i>1?void 0:i?Tt(e,s):e,r=t.length-1,n;r>=0;r--)(n=t[r])&&(o=(i?n(e,s,o):n(o))||o);return i&&o&&kt(e,s,o),o};let q=class extends w{constructor(){super(...arguments),this.message="",this.type="info",this.visible=!1,this._timer=null}render(){return c`
      <div class="toast ${this.type}" @click=${this.dismiss}>
        ${this.message}
      </div>
    `}show(t,e="info"){this._timer&&clearTimeout(this._timer),this.message=t,this.type=e,this.visible=!0,this._timer=setTimeout(()=>this.dismiss(),5e3)}dismiss(){this.visible=!1,this._timer&&(clearTimeout(this._timer),this._timer=null)}};q.styles=D`
    :host {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 100;
      transition: opacity 0.3s, transform 0.3s;
      opacity: 0;
      transform: translateY(-12px);
      pointer-events: none;
    }
    :host([visible]) {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    .toast {
      padding: 12px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
      color: #fff;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      max-width: 400px;
    }
    .toast.info {
      background: var(--primary-color, #03a9f4);
    }
    .toast.warning {
      background: var(--warning-color, #ff9800);
    }
    .toast.error {
      background: var(--error-color, #db4437);
    }
  `,ae([v({type:String})],q.prototype,"message",2),ae([v({type:String})],q.prototype,"type",2),ae([v({type:Boolean,reflect:!0})],q.prototype,"visible",2),q=ae([I("toast-notification")],q);var At=Object.defineProperty,Mt=Object.getOwnPropertyDescriptor,f=(t,e,s,i)=>{for(var o=i>1?void 0:i?Mt(e,s):e,r=t.length-1,n;r>=0;r--)(n=t[r])&&(o=(i?n(e,s,o):n(o))||o);return i&&o&&At(e,s,o),o};const xe=96,It=["0","1","2","3","4","5","6"],Le=[{brightness:3,color:"#1a1a2e",alias:"1%"},{brightness:64,color:"#4a6fa5",alias:"25%"},{brightness:128,color:"#ff9800",alias:"50%"},{brightness:191,color:"#ffc107",alias:"75%"},{brightness:255,color:"#ffeb3b",alias:"100%"}];function le(t){if(t==="daily")return{0:new Array(xe).fill(0)};if(t==="weekly"){const e={};for(const s of It)e[s]=new Array(xe).fill(0);return e}return{}}function Fe(t,e){const s=[],i=new Date(t),o=new Date(e);for(;i<=o;)s.push(i.toISOString().slice(0,10)),i.setDate(i.getDate()+1);return s}let _=class extends w{constructor(){super(...arguments),this.schedule=null,this.isNew=!1,this.globalHvacPresets=[],this.globalColorPresets=[],this.globalBrightnessPresets=[],this.globalScenePresets=[],this._name="",this._entityIds=[],this._cadence="daily",this._repeat=!0,this._startDate="",this._endDate="",this._slots={},this._conflicts=[],this._saving=!1,this._deleting=!1,this._dirty=!1,this._confirmDelete=!1,this._confirmDiscard=!1,this._active=!0,this._overrides={},this._scheduledStates={},this._unavailableEntities=[],this._revertDelay=180,this._slotType="on_off",this._palette=["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ff8800","#ffffff"],this._hvacPresets=[],this._hvacEditIndex=null,this._confirmDeletePresetIndex=null,this._confirmDeletePresetUsage=[],this._paletteEditIndex=null,this._confirmDeletePaletteIndex=null,this._confirmDeletePaletteUsage=[],this._pendingSlotType=null,this._brightnessPresets=[],this._brightnessEditIndex=null,this._confirmDeleteBrightnessIndex=null,this._confirmDeleteBrightnessUsage=[],this._scenePresets=[],this._sceneEditIndex=null,this._confirmDeleteSceneIndex=null,this._confirmDeleteSceneUsage=[],this._isNewPreset=!1,this._unsubOverrides=null}connectedCallback(){super.connectedCallback(),this._subscribeOverrideEvents()}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._unsubOverrides)==null||t.call(this),this._unsubOverrides=null}async _subscribeOverrideEvents(){try{this._unsubOverrides=await this.hass.connection.subscribeEvents(t=>{var s,i;const e=(s=t.data)==null?void 0:s.schedule_id;e&&((i=this.schedule)==null?void 0:i.id)===e&&this._loadOverrides()},"oncue_scheduler_overrides_changed")}catch{}}willUpdate(t){t.has("schedule")?(this._loadFromSchedule(),this._confirmDelete=!1,this._confirmDiscard=!1,this._loadOverrides()):t.has("globalHvacPresets")&&!this._dirty?this._hvacPresets=this.globalHvacPresets.map(e=>({...e})):t.has("globalBrightnessPresets")&&!this._dirty?this._brightnessPresets=this.globalBrightnessPresets.map(e=>({...e})):t.has("globalScenePresets")&&!this._dirty&&(this._scenePresets=this.globalScenePresets.map(e=>({...e})))}get _toast(){return this.renderRoot.querySelector("toast-notification")}_showToast(t,e="info"){var s;(s=this._toast)==null||s.show(t,e)}_loadFromSchedule(){this.schedule?(this._name=this.schedule.name,this._entityIds=[...this.schedule.entity_ids],this._cadence=this.schedule.cadence,this._repeat=this.schedule.repeat,this._startDate=this.schedule.start_date??"",this._endDate=this.schedule.end_date??"",this._slots=JSON.parse(JSON.stringify(this.schedule.slots)),this._active=this.schedule.active,this._revertDelay="revert_delay"in this.schedule?this.schedule.revert_delay:180,this._slotType=this.schedule.slot_type??"on_off",this._palette=this.globalColorPresets.length>0?[...this.globalColorPresets]:["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ff8800","#ffffff"],this._hvacPresets=this.globalHvacPresets.map(t=>({...t})),this._hvacEditIndex=null,this._brightnessPresets=this.globalBrightnessPresets.length>0?this.globalBrightnessPresets.map(t=>({...t})):Le.map(t=>({...t})),this._brightnessEditIndex=null,this._scenePresets=this.globalScenePresets.map(t=>({...t})),this._sceneEditIndex=null):(this._name="",this._entityIds=[],this._cadence="daily",this._repeat=!0,this._startDate="",this._endDate="",this._slots=le("daily"),this._active=!0,this._revertDelay=180,this._slotType="on_off",this._palette=this.globalColorPresets.length>0?[...this.globalColorPresets]:["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ff8800","#ffffff"],this._hvacPresets=this.globalHvacPresets.map(t=>({...t})),this._hvacEditIndex=null,this._brightnessPresets=this.globalBrightnessPresets.length>0?this.globalBrightnessPresets.map(t=>({...t})):Le.map(t=>({...t})),this._brightnessEditIndex=null,this._scenePresets=this.globalScenePresets.map(t=>({...t})),this._sceneEditIndex=null),this._dirty=!1,this._conflicts=[]}render(){if(!this.schedule&&!this.isNew)return c`<div class="empty-msg">Select a schedule or create a new one.</div>`;const t=this._cadence==="custom"&&this._startDate&&this._endDate?Fe(this._startDate,this._endDate):[],e=this._saving||this._deleting;return c`
      <toast-notification></toast-notification>
      <div class="editor-wrapper">
      ${e?c`<div class="loading-overlay"><div class="spinner"></div></div>`:p}
      <div class="editor-header">
        <h2>${this.isNew?"New Schedule":"Edit Schedule"}
          ${this.isNew?p:c`
              <span class="status-toggle">
                <span class="status-dot ${this._active?"active":"paused"}"></span>
                ${this._active?"Active":"Paused"}
                <button class="secondary" @click=${this._toggleActive}>
                  ${this._active?"Pause":"Resume"}
                </button>
              </span>
            `}
        </h2>
        <div class="actions">
          ${this._confirmDiscard?c`
              <div class="inline-confirm">
                <span>Discard changes?</span>
                <button class="danger" @click=${this._doDiscard}>Yes</button>
                <button class="secondary" @click=${()=>{this._confirmDiscard=!1}}>No</button>
              </div>
            `:c`<button class="secondary" @click=${this._onCancel}>Cancel</button>`}
          ${this.isNew?p:this._confirmDelete?c`
                <div class="inline-confirm">
                  <span>Delete?</span>
                  <button class="danger" @click=${this._doDelete}>Yes</button>
                  <button class="secondary" @click=${()=>{this._confirmDelete=!1}}>No</button>
                </div>
              `:c`<button class="danger" @click=${this._onDelete}>Delete</button>`}
          <button class="primary ${this._dirty?"pulse":""}" ?disabled=${e||!this._dirty} @click=${this._onSave}>
            ${this._saving?"Saving...":"Save"}
          </button>
        </div>
      </div>

      <div class="unsaved-banner ${this._dirty&&!this.isNew?"visible":""}">
        ${this._dirty&&!this.isNew?"Changes will not take effect until the schedule is saved.":p}
      </div>

      ${this._conflicts.length>0?c`
            <div class="warning-banner">
              ⚠ Conflicts detected with:
              ${this._conflicts.map(s=>s.schedule_name).join(", ")}
            </div>
          `:p}

      <div class="form">
        <div class="form-group full-width">
          <label for="name">Name</label>
          <input
            id="name"
            type="text"
            .value=${this._name}
            @input=${s=>{this._name=s.target.value,this._dirty=!0}}
            placeholder="My Schedule"
          />
        </div>

        <div class="form-group full-width">
          <div class="cadence-row">
            <div class="cadence-field">
              <label for="slot-type">Slot Type</label>
              <select
                id="slot-type"
                .value=${this._slotType}
                @change=${s=>{const i=s.target.value;if(i!==this._slotType){if(Object.values(this._slots).some(r=>r.some(n=>n!==0))){this._pendingSlotType=i,s.target.value=this._slotType;return}this._slotType=i,this._slots=le(this._cadence),this._cadence==="custom"&&this._rebuildCustomSlots(),this._dirty=!0}}}
              >
                <option value="on_off">On/Off</option>
                <option value="brightness">Brightness / Percentage</option>
                <option value="color">Color</option>
                <option value="hvac">HVAC</option>
                <option value="scene">Scene</option>
              </select>
            </div>
            <div class="cadence-field">
              <label for="cadence">Cadence</label>
              <select
                id="cadence"
                .value=${this._cadence}
                @change=${s=>{const i=s.target.value;this._cadence=i,this._slots=le(i),this._dirty=!0}}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <label class="repeat-check">
              <input
                type="checkbox"
                .checked=${this._repeat}
                @change=${s=>{this._repeat=s.target.checked,this._dirty=!0}}
              />
              Repeat
            </label>
            <div class="cadence-field">
              <label>Revert after</label>
              <div class="revert-row">
                <input
                  type="number"
                  min="0"
                  max="59"
                  style="width: 50px"
                  .value=${this._revertDelay!==null?String(Math.floor(this._revertDelay/60)):"0"}
                  ?disabled=${this._revertDelay===null}
                  @input=${s=>{const i=parseInt(s.target.value)||0,o=(this._revertDelay??0)%60;this._revertDelay=i*60+o,this._dirty=!0}}
                />
                <span>m</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  style="width: 50px"
                  .value=${this._revertDelay!==null?String(this._revertDelay%60):"0"}
                  ?disabled=${this._revertDelay===null}
                  @input=${s=>{const i=parseInt(s.target.value)||0,o=Math.floor((this._revertDelay??0)/60);this._revertDelay=o*60+i,this._dirty=!0}}
                />
                <span>s</span>
                <label class="never-label">
                  <input
                    type="checkbox"
                    .checked=${this._revertDelay===null}
                    @change=${s=>{this._revertDelay=s.target.checked?null:180,this._dirty=!0}}
                  />
                  Never
                </label>
              </div>
            </div>
          </div>
          ${this._pendingSlotType?c`
            <div class="preset-confirm-overlay">
              <p>Changing slot type will <b>clear all scheduled data</b>.</p>
              <p>The current <b>${this._slotType}</b> values are incompatible with <b>${this._pendingSlotType}</b> and cannot be preserved.</p>
              <p style="margin-bottom:0">If you need both types, create a separate schedule instead.</p>
              <div class="confirm-actions">
                <button class="secondary" @click=${()=>{this._pendingSlotType=null}}>Cancel</button>
                <button class="danger" @click=${()=>{this._slotType=this._pendingSlotType,this._pendingSlotType=null,this._slots=le(this._cadence),this._cadence==="custom"&&this._rebuildCustomSlots(),this._dirty=!0}}>Change &amp; Clear</button>
              </div>
            </div>
          `:p}
        </div>

        ${this._cadence==="custom"?c`
              <div class="form-group full-width">
                <div class="date-range-row">
                  <div class="form-group">
                    <label for="start-date">Start Date</label>
                    <input
                      id="start-date"
                      type="date"
                      .value=${this._startDate}
                      @change=${s=>{this._startDate=s.target.value,this._rebuildCustomSlots(),this._dirty=!0}}
                    />
                  </div>
                  <div class="form-group">
                    <label for="end-date">End Date</label>
                    <input
                      id="end-date"
                      type="date"
                      .value=${this._endDate}
                      @change=${s=>{this._endDate=s.target.value,this._rebuildCustomSlots(),this._dirty=!0}}
                    />
                  </div>
                </div>
              </div>
            `:p}

        <div class="form-group full-width">
          <label>Entities</label>
          <entity-picker
            .hass=${this.hass}
            .selectedIds=${this._entityIds}
            .overrides=${this._overrides}
            .scheduledStates=${this._scheduledStates}
            .unavailableEntities=${this._unavailableEntities}
            .showOverrides=${!this.isNew}
            .slotType=${this._slotType}
            @entities-changed=${s=>{this._entityIds=s.detail.entityIds,this._dirty=!0}}
            @override-set=${this._onOverrideSet}
            @override-clear=${this._onOverrideClear}
          ></entity-picker>
        </div>

      </div>

      <div class="grid-section">
        <h3>Time Slots (15-minute intervals)</h3>
        <schedule-grid
          .cadence=${this._cadence}
          .slots=${this._slots}
          .customDates=${t}
          .slotType=${this._slotType}
          .palette=${this._palette}
          .hvacPresets=${this._hvacPresets}
          .brightnessPresets=${this._brightnessPresets}
          .scenePresets=${this._scenePresets}
          @slots-changed=${s=>{this._slots=s.detail.slots,this._dirty=!0}}
          @preset-edit=${s=>{this._onPresetEdit(s.detail.index)}}
          @preset-delete=${s=>{this._onPresetDelete(s.detail.index)}}
          @preset-add=${()=>{this._onPresetAdd()}}
        ></schedule-grid>
      </div>
      </div>

      ${this._renderPresetModal()}
    `}_renderPresetModal(){const t=this._slotType==="color"&&this._paletteEditIndex!==null&&this._paletteEditIndex<this._palette.length,e=this._slotType==="color"&&this._confirmDeletePaletteIndex!==null&&this._confirmDeletePaletteIndex<this._palette.length,s=this._slotType==="hvac"&&this._hvacEditIndex!==null&&this._hvacEditIndex<this._hvacPresets.length,i=this._slotType==="hvac"&&this._confirmDeletePresetIndex!==null&&this._confirmDeletePresetIndex<this._hvacPresets.length,o=this._slotType==="brightness"&&this._brightnessEditIndex!==null&&this._brightnessEditIndex<this._brightnessPresets.length,r=this._slotType==="brightness"&&this._confirmDeleteBrightnessIndex!==null&&this._confirmDeleteBrightnessIndex<this._brightnessPresets.length,n=this._slotType==="scene"&&this._sceneEditIndex!==null&&this._sceneEditIndex<this._scenePresets.length,a=this._slotType==="scene"&&this._confirmDeleteSceneIndex!==null&&this._confirmDeleteSceneIndex<this._scenePresets.length;if(!t&&!e&&!s&&!i&&!o&&!r&&!n&&!a)return p;const l=t||s||o||n,d=e||i||r||a?"Delete Preset":this._isNewPreset?"New Preset":"Edit Preset";return c`
      <div class="modal-backdrop" @click=${g=>{g.target===g.currentTarget&&this._closePresetModal()}}>
        <div class="modal-panel">
          <h3>${d}</h3>
          ${l&&!this._isNewPreset?c`
            <p class="modal-warning">Changes to this preset will affect all schedules that use it.</p>
          `:p}
          ${e?this._renderPaletteDeleteConfirm(this._confirmDeletePaletteIndex):p}
          ${t?this._renderPaletteEditForm(L(this._palette[this._paletteEditIndex]),this._paletteEditIndex):p}
          ${i?this._renderPresetDeleteConfirm(this._confirmDeletePresetIndex):p}
          ${s?this._renderHvacEditForm(this._hvacPresets[this._hvacEditIndex],this._hvacEditIndex):p}
          ${r?this._renderBrightnessDeleteConfirm(this._confirmDeleteBrightnessIndex):p}
          ${o?this._renderBrightnessEditForm(this._brightnessPresets[this._brightnessEditIndex],this._brightnessEditIndex):p}
          ${a?this._renderSceneDeleteConfirm(this._confirmDeleteSceneIndex):p}
          ${n?this._renderSceneEditForm(this._scenePresets[this._sceneEditIndex],this._sceneEditIndex):p}
        </div>
      </div>
    `}_closePresetModal(){this._paletteEditIndex=null,this._hvacEditIndex=null,this._brightnessEditIndex=null,this._sceneEditIndex=null,this._confirmDeletePaletteIndex=null,this._confirmDeletePresetIndex=null,this._confirmDeleteBrightnessIndex=null,this._confirmDeleteSceneIndex=null,this._isNewPreset&&this._cancelNewPreset(),this._isNewPreset=!1}_onPresetEdit(t){this._isNewPreset=!1,this._slotType==="color"?this._paletteEditIndex=t:this._slotType==="hvac"?this._hvacEditIndex=t:this._slotType==="brightness"?this._brightnessEditIndex=t:this._slotType==="scene"&&(this._sceneEditIndex=t)}_onPresetDelete(t){this._slotType==="color"?this._requestDeletePaletteEntry(t):this._slotType==="hvac"?this._requestDeletePreset(t):this._slotType==="brightness"?this._requestDeleteBrightnessPreset(t):this._slotType==="scene"&&this._requestDeleteScenePreset(t)}_onPresetAdd(){this._isNewPreset=!0,this._slotType==="color"?(this._palette=[...this._palette,"#888888"],this._paletteEditIndex=this._palette.length-1,this._dirty=!0):this._slotType==="hvac"?this._addHvacPreset():this._slotType==="brightness"?this._addBrightnessPreset():this._slotType==="scene"&&this._addScenePreset()}_cancelNewPreset(){this._isNewPreset&&(this._slotType==="color"&&this._paletteEditIndex!==null?(this._palette=this._palette.filter((t,e)=>e!==this._paletteEditIndex),this._paletteEditIndex=null):this._slotType==="hvac"&&this._hvacEditIndex!==null?(this._hvacPresets=this._hvacPresets.filter((t,e)=>e!==this._hvacEditIndex),this._hvacEditIndex=null):this._slotType==="brightness"&&this._brightnessEditIndex!==null?(this._brightnessPresets=this._brightnessPresets.filter((t,e)=>e!==this._brightnessEditIndex),this._brightnessEditIndex=null):this._slotType==="scene"&&this._sceneEditIndex!==null&&(this._scenePresets=this._scenePresets.filter((t,e)=>e!==this._sceneEditIndex),this._sceneEditIndex=null),this._isNewPreset=!1)}_hvacPresetLabel(t){const e=[];return t.temperature!==null&&e.push(`${t.temperature}°`),t.hvac_mode&&e.push(t.hvac_mode),t.fan_mode&&e.push(t.fan_mode),e.join(" | ")||"Preset"}_hvacPresetTooltip(t){const e=[];return t.alias&&e.push(t.alias),t.temperature!==null&&e.push(`Temperature: ${t.temperature}°C`),t.hvac_mode&&e.push(`Mode: ${t.hvac_mode}`),t.fan_mode&&e.push(`Fan: ${t.fan_mode}`),e.join(`
`)}_addHvacPreset(){this._hvacPresets=[...this._hvacPresets,{temperature:22,hvac_mode:"cool",fan_mode:"auto",color:"#90caf9"}],this._hvacEditIndex=this._hvacPresets.length-1,this._dirty=!0}_presetSlotCount(t){const e=t+1;let s=0;for(const i of Object.values(this._slots))for(const o of i)o===e&&s++;return s}_renderPresetDeleteConfirm(t){var d;const e=this._hvacPresets[t],s=e.alias||this._hvacPresetLabel(e),i=this._presetSlotCount(t),r=this._confirmDeletePresetUsage.filter(g=>{var u;return g.id!==((u=this.schedule)==null?void 0:u.id)}),n=(d=this.schedule)==null?void 0:d.name,a=i>0;let l;if(a&&r.length>0){const g=r.map(u=>`'${u.name}'`).join(", ");l=c`This preset is in use by this schedule${n?` ('${n}')`:""} and ${g} — affected slots will be cleared.`}else if(a)l=c`This preset is used in <b>${i}</b> slot${i>1?"s":""} in this schedule — they will be cleared.`;else if(r.length>0){const g=r.map(u=>`'${u.name}'`).join(", ");l=c`This preset is in use by ${g} — affected slots will be cleared.`}else l=c`This preset is not used in any schedules.`;return c`
      <div class="preset-confirm-overlay">
        <p>Delete preset <b>${s}</b>?</p>
        <p>${l}</p>
        <div class="confirm-actions">
          <button class="secondary" @click=${()=>{this._confirmDeletePresetIndex=null}}>Cancel</button>
          <button class="danger" @click=${()=>{this._doRemoveHvacPreset(t)}}>Delete</button>
        </div>
      </div>
    `}async _requestDeletePreset(t){this._confirmDeletePresetIndex=t;try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/hvac_preset_usage",index:t});this._confirmDeletePresetUsage=e.schedules??[]}catch{this._confirmDeletePresetUsage=[]}}_doRemoveHvacPreset(t){this._confirmDeletePresetIndex=null;const e=t+1,s={};for(const[i,o]of Object.entries(this._slots))s[i]=o.map(r=>r===e?0:r>e?r-1:r);this._slots=s,this._hvacPresets=this._hvacPresets.filter((i,o)=>o!==t),this._hvacEditIndex!==null&&(this._hvacEditIndex===t?this._hvacEditIndex=null:this._hvacEditIndex>t&&this._hvacEditIndex--),this._dirty=!0}_updateHvacPreset(t,e){const s=[...this._hvacPresets];s[t]={...s[t],...e},this._hvacPresets=s,this._dirty=!0}_renderHvacEditForm(t,e){return c`
      <div class="hvac-edit-form">
        <div class="form-group">
          <label>Temperature (°C)</label>
          <input
            type="number"
            step="0.5"
            .value=${t.temperature!==null?String(t.temperature):""}
            @input=${s=>{const i=s.target.value;this._updateHvacPreset(e,{temperature:i?parseFloat(i):null})}}
          />
        </div>
        <div class="form-group">
          <label>HVAC Mode</label>
          <select
            .value=${t.hvac_mode??""}
            @change=${s=>{const i=s.target.value;this._updateHvacPreset(e,{hvac_mode:i||null})}}
          >
            <option value="">—</option>
            <option value="off">Off</option>
            <option value="heat">Heat</option>
            <option value="cool">Cool</option>
            <option value="heat_cool">Heat/Cool</option>
            <option value="auto">Auto</option>
            <option value="dry">Dry</option>
            <option value="fan_only">Fan Only</option>
          </select>
        </div>
        <div class="form-group">
          <label>Fan Mode</label>
          <select
            .value=${t.fan_mode??""}
            @change=${s=>{const i=s.target.value;this._updateHvacPreset(e,{fan_mode:i||null})}}
          >
            <option value="">—</option>
            <option value="auto">Auto</option>
            <option value="low">Low</option>
            <option value="medium_low">Medium Low</option>
            <option value="medium">Medium</option>
            <option value="medium_high">Medium High</option>
            <option value="high">High</option>
          </select>
        </div>
        <div class="color-alias-row">
          <div class="form-group">
            <label>Color</label>
            <input
              type="color"
              .value=${t.color}
              @input=${s=>{this._updateHvacPreset(e,{color:s.target.value})}}
            />
          </div>
          <div class="form-group alias-input">
            <label>Alias</label>
            <input
              type="text"
              .value=${t.alias??""}
              placeholder="e.g. Daytime Cooling"
              @input=${s=>{this._updateHvacPreset(e,{alias:s.target.value||void 0})}}
            />
          </div>
          <div class="form-group icon-picker-group">
            <label>Icon</label>
            <icon-picker
              .value=${t.icon??""}
              @icon-changed=${s=>{this._updateHvacPreset(e,{icon:s.detail.icon||void 0})}}
            ></icon-picker>
          </div>
        </div>
        <div class="hvac-edit-actions">
          ${this._isNewPreset?c`<button class="danger" @click=${()=>{this._cancelNewPreset()}}>Cancel</button>`:p}
          <button class="secondary" @click=${()=>{this._hvacEditIndex=null,this._isNewPreset=!1}}>Done</button>
        </div>
      </div>
    `}_addBrightnessPreset(){this._brightnessPresets=[...this._brightnessPresets,{brightness:128,color:"#ffc107"}],this._brightnessEditIndex=this._brightnessPresets.length-1,this._dirty=!0}_updateBrightnessPreset(t,e){const s=[...this._brightnessPresets];s[t]={...s[t],...e},this._brightnessPresets=s,this._dirty=!0}async _requestDeleteBrightnessPreset(t){this._confirmDeleteBrightnessIndex=t;try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/brightness_preset_usage",index:t});this._confirmDeleteBrightnessUsage=e.schedules??[]}catch{this._confirmDeleteBrightnessUsage=[]}}_doRemoveBrightnessPreset(t){this._confirmDeleteBrightnessIndex=null;const e=t+1,s={};for(const[i,o]of Object.entries(this._slots))s[i]=o.map(r=>r===e?0:r>e?r-1:r);this._slots=s,this._brightnessPresets=this._brightnessPresets.filter((i,o)=>o!==t),this._brightnessEditIndex!==null&&(this._brightnessEditIndex===t?this._brightnessEditIndex=null:this._brightnessEditIndex>t&&this._brightnessEditIndex--),this._dirty=!0}_renderBrightnessDeleteConfirm(t){const e=this._brightnessPresets[t],s=e.alias||`${Math.round(e.brightness/255*100)}%`,i=this._presetSlotCount(t),r=this._confirmDeleteBrightnessUsage.filter(l=>{var d;return l.id!==((d=this.schedule)==null?void 0:d.id)}),n=i>0;let a;if(n&&r.length>0){const l=r.map(d=>`'${d.name}'`).join(", ");a=c`This preset is in use by this schedule and ${l} — affected slots will be cleared.`}else if(n)a=c`This preset is used in <b>${i}</b> slot${i>1?"s":""} in this schedule — they will be cleared.`;else if(r.length>0){const l=r.map(d=>`'${d.name}'`).join(", ");a=c`This preset is in use by ${l} — affected slots will be cleared.`}else a=c`This preset is not used in any schedules.`;return c`
      <div class="preset-confirm-overlay">
        <p>Delete brightness preset <b>${s}</b>?</p>
        <p>${a}</p>
        <div class="confirm-actions">
          <button class="secondary" @click=${()=>{this._confirmDeleteBrightnessIndex=null}}>Cancel</button>
          <button class="danger" @click=${()=>{this._doRemoveBrightnessPreset(t)}}>Delete</button>
        </div>
      </div>
    `}_renderBrightnessEditForm(t,e){const s=Math.round(t.brightness/255*100);return c`
      <div class="hvac-edit-form">
        <div class="form-group">
          <label>Brightness (${s}%)</label>
          <input
            type="range"
            min="1"
            max="255"
            .value=${String(t.brightness)}
            @input=${i=>{this._updateBrightnessPreset(e,{brightness:parseInt(i.target.value)})}}
          />
        </div>
        <div class="color-alias-row">
          <div class="form-group">
            <label>Color</label>
            <input
              type="color"
              .value=${t.color}
              @input=${i=>{this._updateBrightnessPreset(e,{color:i.target.value})}}
            />
          </div>
          <div class="form-group alias-input">
            <label>Alias</label>
            <input
              type="text"
              .value=${t.alias??""}
              placeholder="e.g. Night Light"
              @input=${i=>{this._updateBrightnessPreset(e,{alias:i.target.value||void 0})}}
            />
          </div>
          <div class="form-group icon-picker-group">
            <label>Icon</label>
            <icon-picker
              .value=${t.icon??""}
              @icon-changed=${i=>{this._updateBrightnessPreset(e,{icon:i.detail.icon||void 0})}}
            ></icon-picker>
          </div>
        </div>
        <div class="color-alias-row">
          <div class="form-group" style="flex:1">
            <label>Transition</label>
            <select
              .value=${t.transition??"snap"}
              @change=${i=>{this._updateBrightnessPreset(e,{transition:i.target.value})}}
            >
              <option value="snap">Snap</option>
              <option value="crossfade">Cross-fade</option>
            </select>
          </div>
        </div>
        ${t.transition==="crossfade"?c`
          <div class="palette-mode-help">
            Gradually fades from this brightness to the next slot's brightness over the time block.
          </div>
        `:p}
        <div class="hvac-edit-actions">
          ${this._isNewPreset?c`<button class="danger" @click=${()=>{this._cancelNewPreset()}}>Cancel</button>`:p}
          <button class="secondary" @click=${()=>{this._brightnessEditIndex=null,this._isNewPreset=!1}}>Done</button>
        </div>
      </div>
    `}_addScenePreset(){this._scenePresets=[...this._scenePresets,{scene_id:"",name:"New Scene",color:"#7c4dff"}],this._sceneEditIndex=this._scenePresets.length-1,this._dirty=!0}_updateScenePreset(t,e){const s=[...this._scenePresets];s[t]={...s[t],...e},this._scenePresets=s,this._dirty=!0}async _requestDeleteScenePreset(t){this._confirmDeleteSceneIndex=t;try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/scene_preset_usage",index:t});this._confirmDeleteSceneUsage=e.schedules??[]}catch{this._confirmDeleteSceneUsage=[]}}_doRemoveScenePreset(t){this._confirmDeleteSceneIndex=null;const e=t+1,s={};for(const[i,o]of Object.entries(this._slots))s[i]=o.map(r=>r===e?0:r>e?r-1:r);this._slots=s,this._scenePresets=this._scenePresets.filter((i,o)=>o!==t),this._sceneEditIndex!==null&&(this._sceneEditIndex===t?this._sceneEditIndex=null:this._sceneEditIndex>t&&this._sceneEditIndex--),this._dirty=!0}_renderSceneDeleteConfirm(t){const e=this._scenePresets[t],s=e.alias||e.name,i=this._presetSlotCount(t),r=this._confirmDeleteSceneUsage.filter(l=>{var d;return l.id!==((d=this.schedule)==null?void 0:d.id)}),n=i>0;let a;if(n&&r.length>0){const l=r.map(d=>`'${d.name}'`).join(", ");a=c`This preset is in use by this schedule and ${l} — affected slots will be cleared.`}else if(n)a=c`This preset is used in <b>${i}</b> slot${i>1?"s":""} in this schedule — they will be cleared.`;else if(r.length>0){const l=r.map(d=>`'${d.name}'`).join(", ");a=c`This preset is in use by ${l} — affected slots will be cleared.`}else a=c`This preset is not used in any schedules.`;return c`
      <div class="preset-confirm-overlay">
        <p>Delete scene preset <b>${s}</b>?</p>
        <p>${a}</p>
        <div class="confirm-actions">
          <button class="secondary" @click=${()=>{this._confirmDeleteSceneIndex=null}}>Cancel</button>
          <button class="danger" @click=${()=>{this._doRemoveScenePreset(t)}}>Delete</button>
        </div>
      </div>
    `}_renderSceneEditForm(t,e){return c`
      <div class="hvac-edit-form">
        <div class="form-group">
          <label>Scene Entity ID</label>
          <input
            type="text"
            .value=${t.scene_id}
            placeholder="scene.my_scene"
            @input=${s=>{this._updateScenePreset(e,{scene_id:s.target.value})}}
          />
        </div>
        <div class="form-group">
          <label>Name</label>
          <input
            type="text"
            .value=${t.name}
            placeholder="Scene name"
            @input=${s=>{this._updateScenePreset(e,{name:s.target.value})}}
          />
        </div>
        <div class="color-alias-row">
          <div class="form-group">
            <label>Color</label>
            <input
              type="color"
              .value=${t.color}
              @input=${s=>{this._updateScenePreset(e,{color:s.target.value})}}
            />
          </div>
          <div class="form-group alias-input">
            <label>Alias</label>
            <input
              type="text"
              .value=${t.alias??""}
              placeholder="e.g. Movie Night"
              @input=${s=>{this._updateScenePreset(e,{alias:s.target.value||void 0})}}
            />
          </div>
          <div class="form-group icon-picker-group">
            <label>Icon</label>
            <icon-picker
              .value=${t.icon??""}
              @icon-changed=${s=>{this._updateScenePreset(e,{icon:s.detail.icon||void 0})}}
            ></icon-picker>
          </div>
        </div>
        <div class="hvac-edit-actions">
          ${this._isNewPreset?c`<button class="danger" @click=${()=>{this._cancelNewPreset()}}>Cancel</button>`:p}
          <button class="secondary" @click=${()=>{this._sceneEditIndex=null,this._isNewPreset=!1}}>Done</button>
        </div>
      </div>
    `}_paletteModeBadge(t){switch(t){case"crossfade":return"⇢";case"cycle":return"⟳";case"tv":return"📺";default:return""}}_paletteEntryTooltip(t){const e=[];return t.mode==="cycle"&&t.alias&&e.push(t.alias),e.push(t.color),t.mode!=="solid"&&e.push(`Mode: ${t.mode}`),t.mode==="cycle"&&t.colors&&(e.push(`Colors: ${t.colors.length}`),e.push(`Transition: ${t.transition??"snap"}`),e.push(`Rate: ${t.rate??1}x per block`)),e.join(`
`)}_renderPaletteDeleteConfirm(t){var d;const e=L(this._palette[t]),s=e.mode==="cycle"&&e.alias?e.alias:e.color,i=this._paletteSlotCount(t),r=this._confirmDeletePaletteUsage.filter(g=>{var u;return g.id!==((u=this.schedule)==null?void 0:u.id)}),n=(d=this.schedule)==null?void 0:d.name,a=i>0;let l;if(a&&r.length>0){const g=r.map(u=>`'${u.name}'`).join(", ");l=c`This preset is in use by this schedule${n?` ('${n}')`:""} and ${g} — affected slots will be cleared.`}else if(a)l=c`This preset is used in <b>${i}</b> slot${i>1?"s":""} in this schedule — they will be cleared.`;else if(r.length>0){const g=r.map(u=>`'${u.name}'`).join(", ");l=c`This preset is in use by ${g} — affected slots will be cleared.`}else l=c`This preset is not used in any schedules.`;return c`
      <div class="preset-confirm-overlay">
        <p>Delete color preset <b>${s}</b>?</p>
        <p>${l}</p>
        <div class="confirm-actions">
          <button class="secondary" @click=${()=>{this._confirmDeletePaletteIndex=null}}>Cancel</button>
          <button class="danger" @click=${()=>{this._doRemovePaletteEntry(t)}}>Delete</button>
        </div>
      </div>
    `}async _requestDeletePaletteEntry(t){this._confirmDeletePaletteIndex=t;try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/color_preset_usage",index:t});this._confirmDeletePaletteUsage=e.schedules??[]}catch{this._confirmDeletePaletteUsage=[]}}_paletteSlotCount(t){const e=t+1;let s=0;for(const i of Object.values(this._slots))for(const o of i)o===e&&s++;return s}_doRemovePaletteEntry(t){this._confirmDeletePaletteIndex=null;const e=t+1,s={};for(const[i,o]of Object.entries(this._slots))s[i]=o.map(r=>r===e?0:r>e?r-1:r);this._slots=s,this._palette=this._palette.filter((i,o)=>o!==t),this._paletteEditIndex!==null&&(this._paletteEditIndex===t?this._paletteEditIndex=null:this._paletteEditIndex>t&&this._paletteEditIndex--),this._dirty=!0}_updatePaletteEntry(t,e){const s=[...this._palette],i=L(s[t]);s[t]={...i,...e},this._palette=s,this._dirty=!0}_renderPaletteEditForm(t,e){const s=t.colors&&t.colors.length>=2?Math.floor(900/(t.colors.length*5)):30;return c`
      <div class="palette-edit-form">
        <div class="palette-edit-row">
          <div class="form-group">
            <label>Color</label>
            <input
              type="color"
              .value=${t.color}
              @input=${i=>{this._updatePaletteEntry(e,{color:i.target.value})}}
            />
          </div>
          <div class="form-group" style="flex:1">
            <label>Mode</label>
            <select
              .value=${t.mode}
              @change=${i=>{const o=i.target.value,r={mode:o};o==="cycle"&&(!t.colors||t.colors.length<2)&&(r.colors=[t.color,"#888888"],r.transition="snap",r.rate=1),this._updatePaletteEntry(e,r)}}
            >
              <option value="solid">Solid</option>
              <option value="crossfade">Cross-fade</option>
              <option value="cycle">Cycle</option>
              <option value="tv">TV Mode</option>
            </select>
          </div>
        </div>

        ${t.mode==="crossfade"?c`
          <div class="palette-mode-help">
            Gradually fades from this color to the next slot's color over the 15-minute block.
          </div>
        `:p}

        ${t.mode==="tv"?c`
          <div class="palette-mode-help">
            Semi-randomly cycles through TV-like colors to simulate light from a television.
          </div>
        `:p}

        ${t.mode==="cycle"?c`
          <div class="cycle-config">
            <label>Cycle Colors</label>
            <div class="cycle-colors">
              ${(t.colors??[]).map((i,o)=>c`
                <div class="palette-entry">
                  <input
                    type="color"
                    .value=${i}
                    @input=${r=>{const n=[...t.colors??[]];n[o]=r.target.value,this._updatePaletteEntry(e,{colors:n})}}
                  />
                  ${(t.colors??[]).length>2?c`
                    <button class="palette-remove" @click=${()=>{const r=(t.colors??[]).filter((n,a)=>a!==o);this._updatePaletteEntry(e,{colors:r})}}>✕</button>
                  `:p}
                </div>
              `)}
              ${(t.colors??[]).length<10?c`
                <button class="palette-add" @click=${()=>{const i=[...t.colors??[],"#888888"];this._updatePaletteEntry(e,{colors:i})}}>+</button>
              `:p}
            </div>
            <div class="cycle-options">
              <div class="form-group" style="flex:2">
                <label>Alias</label>
                <input
                  type="text"
                  .value=${t.alias??""}
                  placeholder="e.g. Christmas Lighting"
                  @input=${i=>{this._updatePaletteEntry(e,{alias:i.target.value||void 0})}}
                />
              </div>
              <div class="form-group">
                <label>Transition</label>
                <select
                  .value=${t.transition??"snap"}
                  @change=${i=>{this._updatePaletteEntry(e,{transition:i.target.value})}}
                >
                  <option value="snap">Snap</option>
                  <option value="fade">Cross-fade</option>
                </select>
              </div>
              <div class="form-group">
                <label>Rate (cycles per block)</label>
                <input
                  type="number"
                  min="0.1"
                  max=${s}
                  step="0.1"
                  .value=${String(t.rate??1)}
                  @input=${i=>{const o=parseFloat(i.target.value);!isNaN(o)&&o>0&&this._updatePaletteEntry(e,{rate:o})}}
                />
              </div>
            </div>
          </div>
        `:p}

        <div class="hvac-edit-actions">
          ${this._isNewPreset?c`<button class="danger" @click=${()=>{this._cancelNewPreset()}}>Cancel</button>`:p}
          <button class="secondary" @click=${()=>{this._paletteEditIndex=null,this._isNewPreset=!1}}>Done</button>
        </div>
      </div>
    `}_rebuildCustomSlots(){if(!this._startDate||!this._endDate)return;const t=Fe(this._startDate,this._endDate),e={};for(const s of t)e[s]=this._slots[s]??new Array(xe).fill(0);this._slots=e}async _onSave(){var e,s,i,o;if(!this._name.trim()){this._showToast("Name is required","error");return}const t=this._entityIds;if(t.length===0){this._showToast("At least one entity ID is required","error");return}this._saving=!0;try{this._slotType==="hvac"&&await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/save_hvac_presets",hvac_presets:this._hvacPresets}),this._slotType==="color"&&await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/save_color_presets",color_presets:this._palette}),this._slotType==="brightness"&&await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/save_brightness_presets",brightness_presets:this._brightnessPresets}),this._slotType==="scene"&&await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/save_scene_presets",scene_presets:this._scenePresets});const r={name:this._name.trim(),entity_ids:t,cadence:this._cadence,repeat:this._repeat,start_date:this._cadence==="custom"&&this._startDate||null,end_date:this._cadence==="custom"&&this._endDate||null,active:this._active,slot_minutes:15,slot_type:this._slotType,slots:this._slots,revert_delay:this._revertDelay};(e=this.schedule)!=null&&e.id&&(r.id=this.schedule.id);const n=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/save",schedule:r});n.conflicts&&n.conflicts.length>0?this._conflicts=n.conflicts:this._conflicts=[],((s=n.warnings)==null?void 0:s.length)>0&&this._showToast(n.warnings[0],"warning"),this._dirty=!1,this.dispatchEvent(new CustomEvent("schedule-saved",{detail:{id:((i=n.schedule)==null?void 0:i.id)??((o=this.schedule)==null?void 0:o.id)},bubbles:!0,composed:!0}))}catch(r){console.error("Failed to save schedule:",r),this._showToast("Failed to save schedule","error")}finally{this._saving=!1}}_onCancel(){if(this._dirty){this._confirmDiscard=!0;return}this.dispatchEvent(new CustomEvent("editor-cancel",{bubbles:!0,composed:!0}))}_toggleActive(){this._active=!this._active,this._dirty=!0}async _loadOverrides(){var t;if(!((t=this.schedule)!=null&&t.id)){this._overrides={},this._scheduledStates={},this._unavailableEntities=[];return}try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get_overrides",schedule_id:this.schedule.id});this._overrides=e.overrides??{},this._scheduledStates=e.scheduled_states??{},this._unavailableEntities=e.unavailable_entities??[]}catch{this._overrides={},this._scheduledStates={},this._unavailableEntities=[]}}async _onOverrideSet(t){var i;if(!((i=this.schedule)!=null&&i.id))return;const{entityId:e,state:s}=t.detail;try{await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/set_override",schedule_id:this.schedule.id,entity_id:e,state:s}),this._overrides={...this._overrides,[e]:s}}catch(o){console.error("Failed to set override:",o),this._showToast("Failed to set override","error")}}async _onOverrideClear(t){var s;if(!((s=this.schedule)!=null&&s.id))return;const{entityId:e}=t.detail;try{await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/clear_override",schedule_id:this.schedule.id,entity_id:e});const i={...this._overrides};delete i[e],this._overrides=i}catch(i){console.error("Failed to clear override:",i),this._showToast("Failed to clear override","error")}}_doDiscard(){this._confirmDiscard=!1,this._dirty=!1,this.dispatchEvent(new CustomEvent("editor-cancel",{bubbles:!0,composed:!0}))}_onDelete(){var t;(t=this.schedule)!=null&&t.id&&(this._confirmDelete=!0)}async _doDelete(){var t;if((t=this.schedule)!=null&&t.id){this._confirmDelete=!1,this._deleting=!0;try{await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/delete",schedule_id:this.schedule.id}),this.dispatchEvent(new CustomEvent("schedule-deleted",{bubbles:!0,composed:!0}))}catch(e){console.error("Failed to delete schedule:",e),this._showToast("Failed to delete schedule","error")}finally{this._deleting=!1}}}};_.styles=[U,D`
      /* ── Host & layout ── */
      :host {
        display: block;
        height: 100%;
        overflow-y: auto;
        padding: 16px;
        box-sizing: border-box;
      }
      .editor-wrapper {
        position: relative;
      }
      .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      .editor-header h2 {
        margin: 0;
        font-size: 18px;
      }
      .actions {
        display: flex;
        gap: 8px;
      }

      /* ── Form layout ── */
      .form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 16px;
      }
      .form .full-width {
        grid-column: 1 / -1;
      }
      .form input[type="text"],
      .form textarea,
      .form select,
      .form input[type="date"] {
        width: 100%;
      }
      textarea {
        min-height: 60px;
        resize: vertical;
      }
      .checkbox-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-top: 20px;
      }
      .revert-row {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .revert-row input[type="number"] {
        width: 60px;
        text-align: center;
      }
      .revert-row span {
        font-size: 13px;
        color: var(--secondary-text-color, #727272);
      }
      .never-label {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        margin-left: 8px;
        cursor: pointer;
      }

      /* ── Cadence & date range ── */
      .cadence-row {
        display: flex;
        align-items: flex-end;
        gap: 8px;
      }
      .cadence-field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
      }
      .cadence-field select {
        width: 100%;
      }
      .cadence-row .repeat-check {
        display: flex;
        align-items: center;
        gap: 4px;
        padding-bottom: 8px;
        white-space: nowrap;
        font-size: 13px;
      }
      .date-range-row {
        display: flex;
        align-items: flex-end;
        gap: 12px;
        flex-wrap: wrap;
      }
      .date-range-row .form-group {
        flex: 1;
        min-width: 120px;
      }
      .date-range-row .repeat-check {
        display: flex;
        align-items: center;
        gap: 6px;
        padding-bottom: 8px;
        white-space: nowrap;
      }
      /* auto-width for all standalone checkboxes */
      .checkbox-row input[type="checkbox"],
      .never-label input[type="checkbox"],
      .cadence-row .repeat-check input[type="checkbox"],
      .date-range-row .repeat-check input[type="checkbox"] {
        width: auto;
      }

      /* ── Status indicator ── */
      .status-toggle {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 500;
      }
      .status-toggle button {
        font-size: 12px;
        padding: 4px 10px;
      }
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
      }
      .status-dot.active {
        background: var(--success-color, #4caf50);
      }
      .status-dot.paused {
        background: var(--disabled-text-color, #bdbdbd);
      }

      /* ── Grid section ── */
      .grid-section {
        margin-top: 16px;
      }
      .grid-section h3 {
        margin: 0 0 8px;
        font-size: 14px;
      }
      .empty-msg {
        text-align: center;
        color: var(--secondary-text-color, #727272);
        padding: 48px 16px;
        font-size: 16px;
      }

      /* ── Shared: color swatch inputs ── */
      input[type="color"] {
        padding: 0;
        border: 1px solid var(--ss-border);
        border-radius: 4px;
        cursor: pointer;
        background: none;
      }

      /* ── Shared: interactive chip base ── */
      .palette-entry-chip,
      .hvac-preset-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border-color 0.15s, box-shadow 0.15s;
        position: relative;
      }
      .palette-entry-chip:hover,
      .hvac-preset-chip:hover {
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      }

      /* ── Shared: circular remove button on chips ── */
      .palette-remove,
      .palette-entry-chip .chip-remove,
      .hvac-preset-chip .chip-remove {
        border-radius: 50%;
        border: none;
        background: var(--error-color, #db4437);
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
      }

      /* ── Shared: edit form panels ── */
      .palette-edit-form,
      .hvac-edit-form,
      .preset-confirm-overlay {
        padding: 12px;
        border: 1px solid var(--ss-border);
        border-radius: 8px;
        background: var(--secondary-background-color, #f5f5f5);
      }

      /* ── Modal overlay for preset editing ── */
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-panel {
        background: var(--card-background-color, #fff);
        border-radius: 12px;
        padding: 20px;
        max-width: 600px;
        width: 90vw;
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }
      .modal-panel h3 {
        margin: 0 0 12px;
        font-size: 16px;
      }
      .modal-warning {
        font-size: 13px;
        color: var(--warning-color, #ff9800);
        margin: 0 0 12px;
        padding: 6px 10px;
        background: rgba(255, 152, 0, 0.1);
        border-radius: 6px;
        border-left: 3px solid var(--warning-color, #ff9800);
      }

      /* ── Shared: flex-wrap item lists ── */
      .palette-editor,
      .hvac-preset-list,
      .cycle-colors {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }

      /* ── Palette (on_off colour swatches) ── */
      .palette-entry {
        position: relative;
        display: inline-flex;
        align-items: center;
      }
      .palette-entry input[type="color"] {
        width: 32px;
        height: 32px;
      }
      .palette-remove {
        position: absolute;
        top: -6px;
        right: -6px;
        width: 16px;
        height: 16px;
        font-size: 10px;
      }
      .palette-add {
        width: 32px;
        height: 32px;
        border: 1px dashed var(--ss-border);
        border-radius: 4px;
        background: transparent;
        cursor: pointer;
        font-size: 18px;
        color: var(--secondary-text-color, #727272);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }
      .palette-add:hover {
        background: var(--ss-cell-off);
      }

      /* ── Palette entry chips (HVAC / cycle mode) ── */
      .palette-entry-chip {
        width: 36px;
        height: 36px;
        border-radius: 6px;
        justify-content: center;
        box-sizing: border-box;
      }
      .palette-entry-chip .palette-mode-label {
        font-size: 14px;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        pointer-events: none;
      }
      .palette-entry-chip .chip-remove {
        position: absolute;
        top: -6px;
        right: -6px;
        width: 14px;
        height: 14px;
        font-size: 9px;
      }

      /* ── Palette edit form ── */
      .palette-edit-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 8px;
      }
      .palette-edit-row {
        display: flex;
        gap: 8px;
        align-items: flex-end;
      }
      .palette-edit-row input[type="color"] {
        width: 36px;
        height: 36px;
      }
      .palette-mode-help {
        font-size: 12px;
        color: var(--secondary-text-color, #727272);
        padding: 4px 0;
      }

      /* ── Cycle configuration ── */
      .cycle-config {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .cycle-options {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
      .cycle-options .form-group {
        flex: 1;
        min-width: 120px;
      }

      /* ── HVAC presets ── */
      .hvac-presets {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .hvac-preset-chip {
        padding: 4px 10px;
        border-radius: 16px;
        font-size: 12px;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0,0,0,0.4);
      }
      .hvac-preset-chip .chip-icon {
        --mdi-icon-size: 16px;
        flex-shrink: 0;
      }
      .hvac-preset-chip .chip-remove {
        width: 14px;
        height: 14px;
        font-size: 9px;
        background: rgba(0,0,0,0.3);
        margin-left: 2px;
      }
      .hvac-preset-chip .chip-remove:hover {
        background: var(--error-color, #db4437);
      }

      /* ── HVAC edit form ── */
      .hvac-edit-form {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 8px;
      }
      .hvac-edit-form .form-group {
        margin-bottom: 0;
      }
      .hvac-edit-form .hvac-edit-actions {
        grid-column: 1 / -1;
        display: flex;
        gap: 6px;
        justify-content: flex-end;
      }
      .hvac-edit-form .color-alias-row {
        display: flex;
        gap: 8px;
        align-items: flex-end;
        grid-column: 1 / -1;
      }
      .hvac-edit-form .color-alias-row input[type="color"] {
        width: 36px;
        height: 36px;
        flex-shrink: 0;
      }
      .hvac-edit-form .color-alias-row .alias-input {
        flex: 1;
      }
      .hvac-edit-form .icon-picker-group {
        flex: 1;
        min-width: 160px;
      }

      /* ── Preset delete confirmation ── */
      .preset-confirm-overlay {
        font-size: 13px;
      }
      .preset-confirm-overlay p {
        margin: 0 0 8px;
      }
      .preset-confirm-overlay .confirm-actions {
        display: flex;
        gap: 6px;
        justify-content: flex-end;
      }

      /* ── Inline confirm & loading overlay ── */
      .inline-confirm {
        display: inline-flex;
        gap: 4px;
        align-items: center;
        font-size: 13px;
      }
      .inline-confirm span {
        color: var(--error-color, #db4437);
        font-weight: 500;
      }
      .inline-confirm button {
        font-size: 12px;
        padding: 4px 8px;
      }
      /* ── Save button states ── */
      button.primary:disabled {
        opacity: 0.5;
        cursor: default;
      }
      button.primary.pulse {
        animation: save-pulse 2s ease-in-out infinite;
      }
      @keyframes save-pulse {
        0%, 100% { box-shadow: 0 0 0 0 transparent; }
        50% { box-shadow: 0 0 8px 2px var(--ss-primary); }
      }

      /* ── Unsaved changes banner ── */
      .unsaved-banner {
        font-size: 13px;
        padding: 8px 12px;
        border-radius: 4px;
        margin-bottom: 12px;
        min-height: 18px;
        box-sizing: content-box;
      }
      .unsaved-banner.visible {
        background: var(--warning-color, #ff9800);
        color: #fff;
      }

      .loading-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        border-radius: 8px;
      }
      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid var(--ss-border);
        border-top-color: var(--ss-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `],f([v({attribute:!1})],_.prototype,"hass",2),f([v({attribute:!1})],_.prototype,"schedule",2),f([v({type:Boolean})],_.prototype,"isNew",2),f([v({attribute:!1})],_.prototype,"globalHvacPresets",2),f([v({attribute:!1})],_.prototype,"globalColorPresets",2),f([v({attribute:!1})],_.prototype,"globalBrightnessPresets",2),f([v({attribute:!1})],_.prototype,"globalScenePresets",2),f([h()],_.prototype,"_name",2),f([h()],_.prototype,"_entityIds",2),f([h()],_.prototype,"_cadence",2),f([h()],_.prototype,"_repeat",2),f([h()],_.prototype,"_startDate",2),f([h()],_.prototype,"_endDate",2),f([h()],_.prototype,"_slots",2),f([h()],_.prototype,"_conflicts",2),f([h()],_.prototype,"_saving",2),f([h()],_.prototype,"_deleting",2),f([h()],_.prototype,"_dirty",2),f([h()],_.prototype,"_confirmDelete",2),f([h()],_.prototype,"_confirmDiscard",2),f([h()],_.prototype,"_active",2),f([h()],_.prototype,"_overrides",2),f([h()],_.prototype,"_scheduledStates",2),f([h()],_.prototype,"_unavailableEntities",2),f([h()],_.prototype,"_revertDelay",2),f([h()],_.prototype,"_slotType",2),f([h()],_.prototype,"_palette",2),f([h()],_.prototype,"_hvacPresets",2),f([h()],_.prototype,"_hvacEditIndex",2),f([h()],_.prototype,"_confirmDeletePresetIndex",2),f([h()],_.prototype,"_confirmDeletePresetUsage",2),f([h()],_.prototype,"_paletteEditIndex",2),f([h()],_.prototype,"_confirmDeletePaletteIndex",2),f([h()],_.prototype,"_confirmDeletePaletteUsage",2),f([h()],_.prototype,"_pendingSlotType",2),f([h()],_.prototype,"_brightnessPresets",2),f([h()],_.prototype,"_brightnessEditIndex",2),f([h()],_.prototype,"_confirmDeleteBrightnessIndex",2),f([h()],_.prototype,"_confirmDeleteBrightnessUsage",2),f([h()],_.prototype,"_scenePresets",2),f([h()],_.prototype,"_sceneEditIndex",2),f([h()],_.prototype,"_confirmDeleteSceneIndex",2),f([h()],_.prototype,"_confirmDeleteSceneUsage",2),f([h()],_.prototype,"_isNewPreset",2),_=f([I("schedule-editor")],_);var Ot=Object.defineProperty,Ht=Object.getOwnPropertyDescriptor,$=(t,e,s,i)=>{for(var o=i>1?void 0:i?Ht(e,s):e,r=t.length-1,n;r>=0;r--)(n=t[r])&&(o=(i?n(e,s,o):n(o))||o);return i&&o&&Ot(e,s,o),o};return x.OnCuePanel=class extends w{constructor(){super(...arguments),this.narrow=!1,this._schedules=[],this._selectedSchedule=null,this._isNew=!1,this._loading=!0,this._sidebarOpen=!0,this._hvacPresets=[],this._colorPresets=[],this._brightnessPresets=[],this._scenePresets=[]}connectedCallback(){super.connectedCallback(),this._loadSchedules(),this._loadHvacPresets(),this._loadColorPresets(),this._loadBrightnessPresets(),this._loadScenePresets()}render(){var e;return this._loading?c`<div class="loading">Loading schedules...</div>`:c`
      <div class="layout">
        <div class="sidebar ${this._sidebarOpen?"":"collapsed"}">
          <schedule-list
            .schedules=${this._schedules}
            .selectedId=${((e=this._selectedSchedule)==null?void 0:e.id)??null}
            @schedule-selected=${this._onScheduleSelected}
            @schedule-add=${this._onAddSchedule}
            @schedule-toggle-active=${this._onToggleActive}
          ></schedule-list>
        </div>
        <div class="main">
          <schedule-editor
            .hass=${this.hass}
            .schedule=${this._selectedSchedule}
            .isNew=${this._isNew}
            .globalHvacPresets=${this._hvacPresets}
            .globalColorPresets=${this._colorPresets}
            .globalBrightnessPresets=${this._brightnessPresets}
            .globalScenePresets=${this._scenePresets}
            @schedule-saved=${this._onScheduleSaved}
            @schedule-deleted=${this._onScheduleDeleted}
            @editor-cancel=${this._onEditorCancel}
            @hvac-presets-changed=${this._onHvacPresetsChanged}
            @color-presets-changed=${this._onColorPresetsChanged}
            @brightness-presets-changed=${this._onBrightnessPresetsChanged}
            @scene-presets-changed=${this._onScenePresetsChanged}
          ></schedule-editor>
        </div>
      </div>
      ${this.narrow?c`
            <button class="toggle-sidebar" @click=${this._toggleSidebar}>
              ${this._sidebarOpen?"✕":"☰"}
            </button>
          `:p}
    `}async _loadSchedules(){try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/list"});this._schedules=e.schedules??[]}catch(e){console.error("Failed to load schedules:",e),this._schedules=[]}finally{this._loading=!1}}async _loadHvacPresets(){try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get_hvac_presets"});this._hvacPresets=e.hvac_presets??[]}catch(e){console.error("Failed to load HVAC presets:",e),this._hvacPresets=[]}}async _loadColorPresets(){try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get_color_presets"});this._colorPresets=e.color_presets??[]}catch(e){console.error("Failed to load color presets:",e),this._colorPresets=[]}}async _onScheduleSelected(e){const s=e.detail.id;try{const i=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get",schedule_id:s});this._selectedSchedule=i.schedule??null,this._isNew=!1}catch(i){console.error("Failed to load schedule:",i)}this.narrow&&(this._sidebarOpen=!1)}_onAddSchedule(){this._selectedSchedule=null,this._isNew=!0,this.narrow&&(this._sidebarOpen=!1)}async _onScheduleSaved(e){var i;await this._loadSchedules(),await this._loadHvacPresets(),await this._loadColorPresets(),await this._loadBrightnessPresets(),await this._loadScenePresets();const s=(i=e.detail)==null?void 0:i.id;if(s)try{const o=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get",schedule_id:s});this._selectedSchedule=o.schedule??null,this._isNew=!1}catch{}}async _onScheduleDeleted(){this._selectedSchedule=null,this._isNew=!1,await this._loadSchedules()}_onEditorCancel(){this._isNew&&(this._isNew=!1,this._selectedSchedule=null)}_toggleSidebar(){this._sidebarOpen=!this._sidebarOpen}async _onToggleActive(e){const{id:s,active:i}=e.detail;try{const r=(await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get",schedule_id:s})).schedule;if(!r)return;r.active=i,await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/save",schedule:r}),await this._loadSchedules(),this._selectedSchedule&&this._selectedSchedule.id===s&&(this._selectedSchedule={...this._selectedSchedule,active:i})}catch(o){console.error("Failed to toggle schedule active state:",o)}}async _onHvacPresetsChanged(){await this._loadHvacPresets()}async _onColorPresetsChanged(){await this._loadColorPresets()}async _loadBrightnessPresets(){try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get_brightness_presets"});this._brightnessPresets=e.brightness_presets??[]}catch(e){console.error("Failed to load brightness presets:",e),this._brightnessPresets=[]}}async _loadScenePresets(){try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get_scene_presets"});this._scenePresets=e.scene_presets??[]}catch(e){console.error("Failed to load scene presets:",e),this._scenePresets=[]}}async _onBrightnessPresetsChanged(){await this._loadBrightnessPresets()}async _onScenePresetsChanged(){await this._loadScenePresets()}},x.OnCuePanel.styles=[U,D`
      :host {
        display: block;
        height: calc(100vh - var(--header-height, 56px));
      }
      .layout {
        display: flex;
        height: 100%;
      }
      .sidebar {
        width: var(--ss-sidebar-width);
        border-right: 1px solid var(--ss-border);
        background: var(--ss-bg);
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: width 0.2s, opacity 0.2s;
      }
      .sidebar.collapsed {
        width: 0;
        opacity: 0;
        pointer-events: none;
      }
      .main {
        flex: 1;
        min-width: 0;
        overflow: hidden;
      }
      .toggle-sidebar {
        position: fixed;
        bottom: 16px;
        left: 16px;
        z-index: 10;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        background: var(--ss-primary);
        color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        padding: 0;
      }
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--secondary-text-color, #727272);
        font-size: 16px;
      }

      @media (max-width: 768px) {
        .sidebar {
          position: fixed;
          top: var(--header-height, 56px);
          left: 0;
          bottom: 0;
          z-index: 5;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
        }
      }
    `],$([v({attribute:!1})],x.OnCuePanel.prototype,"hass",2),$([v({attribute:!1})],x.OnCuePanel.prototype,"panel",2),$([v({type:Boolean})],x.OnCuePanel.prototype,"narrow",2),$([h()],x.OnCuePanel.prototype,"_schedules",2),$([h()],x.OnCuePanel.prototype,"_selectedSchedule",2),$([h()],x.OnCuePanel.prototype,"_isNew",2),$([h()],x.OnCuePanel.prototype,"_loading",2),$([h()],x.OnCuePanel.prototype,"_sidebarOpen",2),$([h()],x.OnCuePanel.prototype,"_hvacPresets",2),$([h()],x.OnCuePanel.prototype,"_colorPresets",2),$([h()],x.OnCuePanel.prototype,"_brightnessPresets",2),$([h()],x.OnCuePanel.prototype,"_scenePresets",2),x.OnCuePanel=$([I("oncue-scheduler-panel")],x.OnCuePanel),Object.defineProperty(x,Symbol.toStringTag,{value:"Module"}),x}({});
