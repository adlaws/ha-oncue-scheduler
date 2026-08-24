var HaOnCueSchedulerPanel=function(b){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ke;const J=globalThis,te=J.ShadowRoot&&(J.ShadyCSS===void 0||J.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,se=Symbol(),pe=new WeakMap;let ue=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==se)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(te&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=pe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&pe.set(t,e))}return e}toString(){return this.cssText}};const Oe=i=>new ue(typeof i=="string"?i:i+"",void 0,se),D=(i,...e)=>{const t=i.length===1?i[0]:e.reduce((s,r,o)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new ue(t,i,se)},Te=(i,e)=>{if(te)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),r=J.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}},fe=te?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return Oe(t)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Me,defineProperty:ze,getOwnPropertyDescriptor:Re,getOwnPropertyNames:Ne,getOwnPropertySymbols:Ie,getPrototypeOf:Ue}=Object,E=globalThis,_e=E.trustedTypes,je=_e?_e.emptyScript:"",ie=E.reactiveElementPolyfillSupport,H=(i,e)=>i,Z={toAttribute(i,e){switch(e){case Boolean:i=i?je:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},re=(i,e)=>!Me(i,e),ge={attribute:!0,type:String,converter:Z,reflect:!1,useDefault:!1,hasChanged:re};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),E.litPropertyMetadata??(E.litPropertyMetadata=new WeakMap);let R=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ge){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&ze(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){const{get:r,set:o}=Re(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:r,set(a){const l=r==null?void 0:r.call(this);o==null||o.call(this,a),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ge}static _$Ei(){if(this.hasOwnProperty(H("elementProperties")))return;const e=Ue(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(H("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(H("properties"))){const t=this.properties,s=[...Ne(t),...Ie(t)];for(const r of s)this.createProperty(r,t[r])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const r of s)t.unshift(fe(r))}else e!==void 0&&t.push(fe(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Te(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostConnected)==null?void 0:s.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var o;const s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){const a=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:Z).toAttribute(t,s.type);this._$Em=e,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(e,t){var o,a;const s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const l=s.getPropertyOptions(r),n=typeof l.converter=="function"?{fromAttribute:l.converter}:((o=l.converter)==null?void 0:o.fromAttribute)!==void 0?l.converter:Z;this._$Em=r;const h=n.fromAttribute(t,l.type);this[r]=h??((a=this._$Ej)==null?void 0:a.get(r))??h,this._$Em=null}}requestUpdate(e,t,s,r=!1,o){var a;if(e!==void 0){const l=this.constructor;if(r===!1&&(o=this[e]),s??(s=l.getPropertyOptions(e)),!((s.hasChanged??re)(o,t)||s.useDefault&&s.reflect&&o===((a=this._$Ej)==null?void 0:a.get(e))&&!this.hasAttribute(l._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:r,wrapped:o},a){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,a??t??this[e]),o!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,a]of this._$Ep)this[o]=a;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,a]of r){const{wrapped:l}=a,n=this[o];l!==!0||this._$AL.has(o)||n===void 0||this.C(o,void 0,a,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(s=this._$EO)==null||s.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};R.elementStyles=[],R.shadowRootOptions={mode:"open"},R[H("elementProperties")]=new Map,R[H("finalized")]=new Map,ie==null||ie({ReactiveElement:R}),(E.reactiveElementVersions??(E.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const L=globalThis,ve=i=>i,G=L.trustedTypes,ye=G?G.createPolicy("lit-html",{createHTML:i=>i}):void 0,be="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,me="?"+P,He=`<${me}>`,k=document,B=()=>k.createComment(""),F=i=>i===null||typeof i!="object"&&typeof i!="function",oe=Array.isArray,Le=i=>oe(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",ae=`[ 	
\f\r]`,q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$e=/-->/g,xe=/>/g,O=RegExp(`>|${ae}(?:([^\\s"'>=/]+)(${ae}*=${ae}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),we=/'/g,Se=/"/g,Ae=/^(?:script|style|textarea|title)$/i,Be=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),d=Be(1),N=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Ee=new WeakMap,T=k.createTreeWalker(k,129);function Pe(i,e){if(!oe(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ye!==void 0?ye.createHTML(e):e}const Fe=(i,e)=>{const t=i.length-1,s=[];let r,o=e===2?"<svg>":e===3?"<math>":"",a=q;for(let l=0;l<t;l++){const n=i[l];let h,y,f=-1,A=0;for(;A<n.length&&(a.lastIndex=A,y=a.exec(n),y!==null);)A=a.lastIndex,a===q?y[1]==="!--"?a=$e:y[1]!==void 0?a=xe:y[2]!==void 0?(Ae.test(y[2])&&(r=RegExp("</"+y[2],"g")),a=O):y[3]!==void 0&&(a=O):a===O?y[0]===">"?(a=r??q,f=-1):y[1]===void 0?f=-2:(f=a.lastIndex-y[2].length,h=y[1],a=y[3]===void 0?O:y[3]==='"'?Se:we):a===Se||a===we?a=O:a===$e||a===xe?a=q:(a=O,r=void 0);const C=a===O&&i[l+1].startsWith("/>")?" ":"";o+=a===q?n+He:f>=0?(s.push(h),n.slice(0,f)+be+n.slice(f)+P+C):n+P+(f===-2?l:C)}return[Pe(i,o+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class V{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let o=0,a=0;const l=e.length-1,n=this.parts,[h,y]=Fe(e,t);if(this.el=V.createElement(h,s),T.currentNode=this.el.content,t===2||t===3){const f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(r=T.nextNode())!==null&&n.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const f of r.getAttributeNames())if(f.endsWith(be)){const A=y[a++],C=r.getAttribute(f).split(P),ee=/([.?@])?(.*)/.exec(A);n.push({type:1,index:o,name:ee[2],strings:C,ctor:ee[1]==="."?Ve:ee[1]==="?"?We:ee[1]==="@"?Ye:X}),r.removeAttribute(f)}else f.startsWith(P)&&(n.push({type:6,index:o}),r.removeAttribute(f));if(Ae.test(r.tagName)){const f=r.textContent.split(P),A=f.length-1;if(A>0){r.textContent=G?G.emptyScript:"";for(let C=0;C<A;C++)r.append(f[C],B()),T.nextNode(),n.push({type:2,index:++o});r.append(f[A],B())}}}else if(r.nodeType===8)if(r.data===me)n.push({type:2,index:o});else{let f=-1;for(;(f=r.data.indexOf(P,f+1))!==-1;)n.push({type:7,index:o}),f+=P.length-1}o++}}static createElement(e,t){const s=k.createElement("template");return s.innerHTML=e,s}}function I(i,e,t=i,s){var a,l;if(e===N)return e;let r=s!==void 0?(a=t._$Co)==null?void 0:a[s]:t._$Cl;const o=F(e)?void 0:e._$litDirective$;return(r==null?void 0:r.constructor)!==o&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,t,s)),s!==void 0?(t._$Co??(t._$Co=[]))[s]=r:t._$Cl=r),r!==void 0&&(e=I(i,r._$AS(i,e.values),r,s)),e}class qe{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,r=((e==null?void 0:e.creationScope)??k).importNode(t,!0);T.currentNode=r;let o=T.nextNode(),a=0,l=0,n=s[0];for(;n!==void 0;){if(a===n.index){let h;n.type===2?h=new W(o,o.nextSibling,this,e):n.type===1?h=new n.ctor(o,n.name,n.strings,this,e):n.type===6&&(h=new Ke(o,this,e)),this._$AV.push(h),n=s[++l]}a!==(n==null?void 0:n.index)&&(o=T.nextNode(),a++)}return T.currentNode=k,r}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class W{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,s,r){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=I(this,e,t),F(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==N&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Le(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&F(this._$AH)?this._$AA.nextSibling.data=e:this.T(k.createTextNode(e)),this._$AH=e}$(e){var o;const{values:t,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=V.createElement(Pe(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===r)this._$AH.p(t);else{const a=new qe(r,this),l=a.u(this.options);a.p(t),this.T(l),this._$AH=a}}_$AC(e){let t=Ee.get(e.strings);return t===void 0&&Ee.set(e.strings,t=new V(e)),t}k(e){oe(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,r=0;for(const o of e)r===t.length?t.push(s=new W(this.O(B()),this.O(B()),this,this.options)):s=t[r],s._$AI(o),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e!==this._$AB;){const r=ve(e).nextSibling;ve(e).remove(),e=r}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(e,t=this,s,r){const o=this.strings;let a=!1;if(o===void 0)e=I(this,e,t,0),a=!F(e)||e!==this._$AH&&e!==N,a&&(this._$AH=e);else{const l=e;let n,h;for(e=o[0],n=0;n<o.length-1;n++)h=I(this,l[s+n],t,n),h===N&&(h=this._$AH[n]),a||(a=!F(h)||h!==this._$AH[n]),h===p?e=p:e!==p&&(e+=(h??"")+o[n+1]),this._$AH[n]=h}a&&!r&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Ve extends X{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}}class We extends X{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}}class Ye extends X{constructor(e,t,s,r,o){super(e,t,s,r,o),this.type=5}_$AI(e,t=this){if((e=I(this,e,t,0)??p)===N)return;const s=this._$AH,r=e===p&&s!==p||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==p&&(s===p||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Ke{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){I(this,e)}}const ne=L.litHtmlPolyfillSupport;ne==null||ne(V,W),(L.litHtmlVersions??(L.litHtmlVersions=[])).push("3.3.3");const Je=(i,e,t)=>{const s=(t==null?void 0:t.renderBefore)??e;let r=s._$litPart$;if(r===void 0){const o=(t==null?void 0:t.renderBefore)??null;s._$litPart$=r=new W(e.insertBefore(B(),o),o,void 0,t??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const M=globalThis;class x extends R{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Je(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return N}}x._$litElement$=!0,x.finalized=!0,(ke=M.litElementHydrateSupport)==null||ke.call(M,{LitElement:x});const le=M.litElementPolyfillSupport;le==null||le({LitElement:x}),(M.litElementVersions??(M.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const U=i=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(i,e)}):customElements.define(i,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ze={attribute:!0,type:String,converter:Z,reflect:!1,hasChanged:re},Ge=(i=Ze,e,t)=>{const{kind:s,metadata:r}=t;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(t.name,i),s==="accessor"){const{name:a}=t;return{set(l){const n=e.get.call(this);e.set.call(this,l),this.requestUpdate(a,n,i,!0,l)},init(l){return l!==void 0&&this.C(a,void 0,i,l),l}}}if(s==="setter"){const{name:a}=t;return function(l){const n=this[a];e.call(this,l),this.requestUpdate(a,n,i,!0,l)}}throw Error("Unsupported decorator location: "+s)};function _(i){return(e,t)=>typeof t=="object"?Ge(i,e,t):((s,r,o)=>{const a=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),a?Object.getOwnPropertyDescriptor(r,o):void 0})(i,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function c(i){return _({...i,state:!0,attribute:!1})}const Y=D`
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
`;var Xe=Object.defineProperty,Qe=Object.getOwnPropertyDescriptor,de=(i,e,t,s)=>{for(var r=s>1?void 0:s?Qe(e,t):e,o=i.length-1,a;o>=0;o--)(a=i[o])&&(r=(s?a(e,t,r):a(r))||r);return s&&r&&Xe(e,t,r),r};let K=class extends x{constructor(){super(...arguments),this.schedules=[],this.selectedId=null}render(){return d`
      <div class="header">
        <h2>Schedules</h2>
        <button class="primary" @click=${this._onAdd}>+ Add</button>
      </div>
      <div class="list">
        ${this.schedules.length===0?d`<div class="empty">No schedules yet. Click + Add to create one.</div>`:this.schedules.map(i=>d`
                <div
                  class="item ${i.id===this.selectedId?"selected":""}"
                  @click=${()=>this._onSelect(i.id)}
                >
                  <div
                    class="status-dot ${i.active?"active":"paused"}"
                    title=${i.active?"Active":"Paused"}
                  ></div>
                  <div class="item-info">
                    <div class="item-name">${i.name}</div>
                    <div class="item-meta">
                      <span class="badge badge-${i.cadence}">${i.cadence}</span>
                      ${i.entity_ids.length} ${i.entity_ids.length!==1?"entities":"entity"}
                    </div>
                  </div>
                  <button
                    class="toggle-btn"
                    title=${i.active?"Pause schedule":"Resume schedule"}
                    @click=${e=>{e.stopPropagation(),this._onToggleActive(i.id,!i.active)}}
                  >${i.active?"Pause":"Resume"}</button>
                </div>
              `)}
      </div>
    `}_onSelect(i){this.dispatchEvent(new CustomEvent("schedule-selected",{detail:{id:i},bubbles:!0,composed:!0}))}_onAdd(){this.dispatchEvent(new CustomEvent("schedule-add",{bubbles:!0,composed:!0}))}_onToggleActive(i,e){this.dispatchEvent(new CustomEvent("schedule-toggle-active",{detail:{id:i,active:e},bubbles:!0,composed:!0}))}};K.styles=[Y,D`
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
    `],de([_({type:Array})],K.prototype,"schedules",2),de([_({type:String})],K.prototype,"selectedId",2),K=de([U("schedule-list")],K);var et=Object.defineProperty,tt=Object.getOwnPropertyDescriptor,m=(i,e,t,s)=>{for(var r=s>1?void 0:s?tt(e,t):e,o=i.length-1,a;o>=0;o--)(a=i[o])&&(r=(s?a(e,t,r):a(r))||r);return s&&r&&et(e,t,r),r};const z=96,st=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],Ce=["0","1","2","3","4","5","6"];let v=class extends x{constructor(){super(...arguments),this.cadence="daily",this.slots={},this.customDates=[],this.slotType="on_off",this.palette=[],this._dragActive=!1,this._dragValue=0,this._dragStartRow=-1,this._dragStartCol=-1,this._dragEndRow=-1,this._dragEndCol=-1,this._page=0,this._activePaletteIndex=1,this._daysPerPage=56}get _dayKeys(){if(this.cadence==="daily")return["0"];if(this.cadence==="weekly")return Ce;const i=this.customDates;if(i.length<=this._daysPerPage)return i;const e=this._page*this._daysPerPage;return i.slice(e,e+this._daysPerPage)}get _totalPages(){return this.cadence!=="custom"?1:Math.max(1,Math.ceil(this.customDates.length/this._daysPerPage))}_renderLabel(i){if(this.cadence!=="custom")return this._dayLabel(i);const e=new Date(i+"T00:00:00"),t=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][e.getDay()];return d`<span class="day-name">${t}</span><span class="day-date">${i}</span>`}_dayLabel(i){if(this.cadence==="daily")return"Every day";if(this.cadence==="weekly")return st[parseInt(i)]??i;const e=new Date(i+"T00:00:00");return`${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][e.getDay()]} ${i}`}render(){const i=this._dayKeys,e=Array.from({length:24},(s,r)=>r),t=this.slotType==="color";return d`
      ${t?this._renderPaletteBar():p}
      <div class="toolbar">
        ${t?d`
              <button class="secondary" @click=${()=>this._bulkSet(this._activePaletteIndex)}>Fill All</button>
              <button class="secondary" @click=${()=>this._bulkSet(0)}>Clear All</button>
            `:d`
              <button class="secondary" @click=${()=>this._bulkSet(1)}>All On</button>
              <button class="secondary" @click=${()=>this._bulkSet(0)}>All Off</button>
            `}
        ${this.cadence==="weekly"?d`
              <button class="secondary" @click=${this._copyMondayToAll}>Copy Mon → All</button>
            `:p}
      </div>
      <div class="grid-container">
        <div class="grid" @mouseup=${this._onMouseUp} @mouseleave=${this._onMouseUp}>
          <!-- hour headers -->
          <div class="header-spacer"></div>
          ${e.map(s=>d`
              <div class="header-cell" style="grid-column: span 4">${String(s).padStart(2,"0")}</div>
            `)}

          <!-- rows -->
          ${i.map((s,r)=>this._renderRow(s,r))}
        </div>
      </div>
      ${this.cadence==="custom"&&this._totalPages>1?d`
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
    `}_weekIndex(i){if(this.cadence!=="custom")return 0;const e=new Date(i+"T00:00:00"),t=this.customDates;if(t.length===0)return 0;const s=new Date(t[0]+"T00:00:00"),r=new Date(s);r.setDate(s.getDate()-s.getDay());const o=Math.floor((e.getTime()-r.getTime())/864e5);return Math.floor(o/7)}_renderRow(i,e){const t=this.slots[i]??new Array(z).fill(0),s=this.slotType==="color",r=this.cadence==="custom"&&this._weekIndex(i)%2===1;return d`
      <div class="row-label ${r?"week-even":""}">${this._renderLabel(i)}</div>
      ${t.map((o,a)=>{const l=this._isInDragRegion(e,a),n=s?this._colorCellStyle(o):"";return d`
          <div
            class="cell ${s?o?"color-set":"off":o?"on":"off"} ${r&&!o?"week-even":""} ${l?"drag-preview":""} ${a%4===0?"hour-start":""}"
            style=${n}
            data-row=${e}
            data-col=${a}
            data-day=${i}
            title="${this._cellTooltip(a)}"
            @mousedown=${h=>this._onMouseDown(h,e,a,i)}
            @mouseenter=${h=>this._onMouseEnter(h,e,a)}
            @touchstart=${h=>this._onTouchStart(h,e,a,i)}
            @touchmove=${this._onTouchMove}
            @touchend=${this._onTouchEnd}
          ></div>
        `})}
    `}_cellTooltip(i){const e=Math.floor(i*15/60),t=i*15%60,s=Math.floor((i+1)*15/60),r=(i+1)*15%60;return`${String(e).padStart(2,"0")}:${String(t).padStart(2,"0")} – ${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}_colorCellStyle(i){return i===0||!this.palette||i>this.palette.length?"":`background: ${this.palette[i-1]}`}_renderPaletteBar(){return d`
      <div class="palette-bar">
        <span>Paint:</span>
        <div
          class="palette-swatch eraser ${this._activePaletteIndex===0?"active":""}"
          title="Eraser"
          @click=${()=>{this._activePaletteIndex=0}}
        >✕</div>
        ${this.palette.map((i,e)=>d`
          <div
            class="palette-swatch ${this._activePaletteIndex===e+1?"active":""}"
            style="background: ${i}"
            title="${i}"
            @click=${()=>{this._activePaletteIndex=e+1}}
          ></div>
        `)}
      </div>
    `}_isInDragRegion(i,e){if(!this._dragActive)return!1;const t=Math.min(this._dragStartRow,this._dragEndRow),s=Math.max(this._dragStartRow,this._dragEndRow),r=Math.min(this._dragStartCol,this._dragEndCol),o=Math.max(this._dragStartCol,this._dragEndCol);return i>=t&&i<=s&&e>=r&&e<=o}_onMouseDown(i,e,t,s){i.preventDefault();const r=this.slots[s]??new Array(z).fill(0);this.slotType==="color"?this._dragValue=r[t]===this._activePaletteIndex?0:this._activePaletteIndex:this._dragValue=r[t]?0:1,this._dragStartRow=e,this._dragStartCol=t,this._dragEndRow=e,this._dragEndCol=t,this._dragActive=!0}_onMouseEnter(i,e,t){this._dragActive&&(this._dragEndRow=e,this._dragEndCol=t)}_onMouseUp(){this._dragActive&&(this._applyDrag(),this._dragActive=!1)}_onTouchStart(i,e,t,s){i.preventDefault();const r=this.slots[s]??new Array(z).fill(0);this.slotType==="color"?this._dragValue=r[t]===this._activePaletteIndex?0:this._activePaletteIndex:this._dragValue=r[t]?0:1,this._dragStartRow=e,this._dragStartCol=t,this._dragEndRow=e,this._dragEndCol=t,this._dragActive=!0}_onTouchMove(i){var s;if(!this._dragActive)return;const e=i.touches[0],t=(s=this.shadowRoot)==null?void 0:s.elementFromPoint(e.clientX,e.clientY);(t==null?void 0:t.dataset.row)!==void 0&&(t==null?void 0:t.dataset.col)!==void 0&&(this._dragEndRow=parseInt(t.dataset.row),this._dragEndCol=parseInt(t.dataset.col))}_onTouchEnd(){this._dragActive&&(this._applyDrag(),this._dragActive=!1)}_applyDrag(){const i=this._dayKeys,e=Math.min(this._dragStartRow,this._dragEndRow),t=Math.max(this._dragStartRow,this._dragEndRow),s=Math.min(this._dragStartCol,this._dragEndCol),r=Math.max(this._dragStartCol,this._dragEndCol),o={...this.slots};for(let a=e;a<=t;a++){const l=i[a];if(!l)continue;const n=[...o[l]??new Array(z).fill(0)];for(let h=s;h<=r;h++)n[h]=this._dragValue;o[l]=n}this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:o},bubbles:!0,composed:!0}))}_bulkSet(i){const e=this.cadence==="custom"?this.customDates:this._dayKeys,t={};for(const s of e)t[s]=new Array(z).fill(i);this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:t},bubbles:!0,composed:!0}))}_copyMondayToAll(){const i=this.slots[0]??new Array(z).fill(0),e={};for(const t of Ce)e[t]=[...i];this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:e},bubbles:!0,composed:!0}))}_prevPage(){this._page=Math.max(0,this._page-1)}_nextPage(){this._page=Math.min(this._totalPages-1,this._page+1)}};v.styles=[Y,D`
      :host {
        display: block;
        --_grid-bg: var(--ha-card-background, var(--card-background-color, var(--primary-background-color, #fafafa)));
      }
      .grid-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 0.5em;
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
        grid-template-columns: 130px repeat(${z}, minmax(var(--ss-cell-size), 1fr));
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
    `],m([_({type:String})],v.prototype,"cadence",2),m([_({type:Object})],v.prototype,"slots",2),m([_({type:Array})],v.prototype,"customDates",2),m([_({type:String})],v.prototype,"slotType",2),m([_({type:Array})],v.prototype,"palette",2),m([c()],v.prototype,"_dragActive",2),m([c()],v.prototype,"_dragValue",2),m([c()],v.prototype,"_dragStartRow",2),m([c()],v.prototype,"_dragStartCol",2),m([c()],v.prototype,"_dragEndRow",2),m([c()],v.prototype,"_dragEndCol",2),m([c()],v.prototype,"_page",2),m([c()],v.prototype,"_activePaletteIndex",2),v=m([U("schedule-grid")],v);var it=Object.defineProperty,rt=Object.getOwnPropertyDescriptor,w=(i,e,t,s)=>{for(var r=s>1?void 0:s?rt(e,t):e,o=i.length-1,a;o>=0;o--)(a=i[o])&&(r=(s?a(e,t,r):a(r))||r);return s&&r&&it(e,t,r),r};const ot=["switch","light","fan","input_boolean"],at=["rgb","rgbw","rgbww","hs","xy"];let $=class extends x{constructor(){super(...arguments),this.slotType="on_off",this.selectedIds=[],this.overrides={},this.scheduledStates={},this.showOverrides=!1,this._query="",this._open=!1}get _availableEntities(){var t;if(!((t=this.hass)!=null&&t.states))return[];const i=new Set(this.selectedIds),e=this.slotType==="color";return Object.keys(this.hass.states).filter(s=>{var o,a;if(i.has(s))return!1;const r=s.split(".")[0];if(e){if(r!=="light")return!1;const l=(a=(o=this.hass.states[s])==null?void 0:o.attributes)==null?void 0:a.supported_color_modes;return Array.isArray(l)&&l.some(n=>at.includes(n))}return ot.includes(r)}).map(s=>{var r,o;return{id:s,name:((o=(r=this.hass.states[s])==null?void 0:r.attributes)==null?void 0:o.friendly_name)??s}}).sort((s,r)=>s.id.localeCompare(r.id))}get _filtered(){const i=this._query.toLowerCase();return i?this._availableEntities.filter(e=>e.id.toLowerCase().includes(i)||e.name.toLowerCase().includes(i)):this._availableEntities}render(){return d`
      <div class="entity-list">
        ${this.selectedIds.map(i=>this._renderEntityRow(i))}
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
    `}_renderEntityRow(i){var l,n,h;const e=this.overrides[i],t=this.scheduledStates[i],s=((h=(n=(l=this.hass)==null?void 0:l.states)==null?void 0:n[i])==null?void 0:h.state)==="on"?"on":"off";let r="";this.showOverrides&&e&&(r=e===t?"override-match":"override-conflict");const o=e==="on"?"active-on":!e&&this.showOverrides&&s==="on"?"current-state":"",a=e==="off"?"active-off":!e&&this.showOverrides&&s==="off"?"current-state":"";return d`
      <div class="entity-row ${r}">
        <span class="entity-name">
          <ha-icon .icon=${this._entityIcon(i)??""}
            style="visibility: ${this._entityIcon(i)?"visible":"hidden"}"
          ></ha-icon>
          ${this._friendlyName(i)}
          <span class="entity-id">${i}</span>
        </span>
        ${this.showOverrides&&this.slotType!=="color"?d`
          <span class="override-controls">
            <button
              class="override-btn ${o}"
              title="Override On"
              @click=${()=>this._onOverride(i,"on")}
            >On</button>
            <button
              class="override-btn ${a}"
              title="Override Off"
              @click=${()=>this._onOverride(i,"off")}
            >Off</button>
          </span>
        `:p}
        <button class="entity-remove" @click=${()=>this._remove(i)}>✕</button>
      </div>
    `}_renderDropdown(){const i=this._filtered;return i.length===0?d`<div class="dropdown"><div class="no-results">No matching entities</div></div>`:d`
      <div class="dropdown">
        ${i.map(e=>d`
            <div class="option" @mousedown=${t=>{t.preventDefault(),this._select(e.id)}}>
              <span class="option-id">${e.id}</span>
              <span class="option-name">${e.name}</span>
            </div>
          `)}
      </div>
    `}_friendlyName(i){var e,t,s,r;return((r=(s=(t=(e=this.hass)==null?void 0:e.states)==null?void 0:t[i])==null?void 0:s.attributes)==null?void 0:r.friendly_name)??i}_entityIcon(i){var e,t,s,r;return(r=(s=(t=(e=this.hass)==null?void 0:e.states)==null?void 0:t[i])==null?void 0:s.attributes)==null?void 0:r.icon}_onInput(i){this._query=i.target.value,this._open=!0}_onBlur(){setTimeout(()=>{this._open=!1},150)}_select(i){const e=[...this.selectedIds,i];this._query="",this._fireChanged(e)}_remove(i){const e=this.selectedIds.filter(t=>t!==i);this._fireChanged(e)}_onOverride(i,e){this.overrides[i]===e?this.dispatchEvent(new CustomEvent("override-clear",{detail:{entityId:i},bubbles:!0,composed:!0})):this.dispatchEvent(new CustomEvent("override-set",{detail:{entityId:i,state:e},bubbles:!0,composed:!0}))}_fireChanged(i){this.dispatchEvent(new CustomEvent("entities-changed",{detail:{entityIds:i},bubbles:!0,composed:!0}))}};$.styles=[Y,D`
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
      .entity-name ha-icon {
        flex-shrink: 0;
        --mdc-icon-size: 18px;
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
    `],w([_({attribute:!1})],$.prototype,"hass",2),w([_({type:String})],$.prototype,"slotType",2),w([_({type:Array})],$.prototype,"selectedIds",2),w([_({type:Object})],$.prototype,"overrides",2),w([_({type:Object})],$.prototype,"scheduledStates",2),w([_({type:Boolean})],$.prototype,"showOverrides",2),w([c()],$.prototype,"_query",2),w([c()],$.prototype,"_open",2),$=w([U("entity-picker")],$);var nt=Object.defineProperty,lt=Object.getOwnPropertyDescriptor,Q=(i,e,t,s)=>{for(var r=s>1?void 0:s?lt(e,t):e,o=i.length-1,a;o>=0;o--)(a=i[o])&&(r=(s?a(e,t,r):a(r))||r);return s&&r&&nt(e,t,r),r};let j=class extends x{constructor(){super(...arguments),this.message="",this.type="info",this.visible=!1,this._timer=null}render(){return d`
      <div class="toast ${this.type}" @click=${this.dismiss}>
        ${this.message}
      </div>
    `}show(i,e="info"){this._timer&&clearTimeout(this._timer),this.message=i,this.type=e,this.visible=!0,this._timer=setTimeout(()=>this.dismiss(),5e3)}dismiss(){this.visible=!1,this._timer&&(clearTimeout(this._timer),this._timer=null)}};j.styles=D`
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
  `,Q([_({type:String})],j.prototype,"message",2),Q([_({type:String})],j.prototype,"type",2),Q([_({type:Boolean,reflect:!0})],j.prototype,"visible",2),j=Q([U("toast-notification")],j);var dt=Object.defineProperty,ct=Object.getOwnPropertyDescriptor,g=(i,e,t,s)=>{for(var r=s>1?void 0:s?ct(e,t):e,o=i.length-1,a;o>=0;o--)(a=i[o])&&(r=(s?a(e,t,r):a(r))||r);return s&&r&&dt(e,t,r),r};const ce=96,ht=["0","1","2","3","4","5","6"];function he(i){if(i==="daily")return{0:new Array(ce).fill(0)};if(i==="weekly"){const e={};for(const t of ht)e[t]=new Array(ce).fill(0);return e}return{}}function De(i,e){const t=[],s=new Date(i),r=new Date(e);for(;s<=r;)t.push(s.toISOString().slice(0,10)),s.setDate(s.getDate()+1);return t}let u=class extends x{constructor(){super(...arguments),this.schedule=null,this.isNew=!1,this._name="",this._entityIds=[],this._cadence="daily",this._repeat=!0,this._startDate="",this._endDate="",this._slots={},this._conflicts=[],this._saving=!1,this._deleting=!1,this._dirty=!1,this._confirmDelete=!1,this._confirmDiscard=!1,this._active=!0,this._overrides={},this._scheduledStates={},this._revertDelay=180,this._slotType="on_off",this._palette=["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ff8800","#ffffff"]}willUpdate(i){i.has("schedule")&&(this._loadFromSchedule(),this._confirmDelete=!1,this._confirmDiscard=!1,this._loadOverrides())}get _toast(){return this.renderRoot.querySelector("toast-notification")}_showToast(i,e="info"){var t;(t=this._toast)==null||t.show(i,e)}_loadFromSchedule(){this.schedule?(this._name=this.schedule.name,this._entityIds=[...this.schedule.entity_ids],this._cadence=this.schedule.cadence,this._repeat=this.schedule.repeat,this._startDate=this.schedule.start_date??"",this._endDate=this.schedule.end_date??"",this._slots=JSON.parse(JSON.stringify(this.schedule.slots)),this._active=this.schedule.active,this._revertDelay="revert_delay"in this.schedule?this.schedule.revert_delay:180,this._slotType=this.schedule.slot_type??"on_off",this._palette=this.schedule.palette?[...this.schedule.palette]:["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ff8800","#ffffff"]):(this._name="",this._entityIds=[],this._cadence="daily",this._repeat=!0,this._startDate="",this._endDate="",this._slots=he("daily"),this._active=!0,this._revertDelay=180,this._slotType="on_off",this._palette=["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ff8800","#ffffff"]),this._dirty=!1,this._conflicts=[]}render(){if(!this.schedule&&!this.isNew)return d`<div class="empty-msg">Select a schedule or create a new one.</div>`;const i=this._cadence==="custom"&&this._startDate&&this._endDate?De(this._startDate,this._endDate):[],e=this._saving||this._deleting;return d`
      <toast-notification></toast-notification>
      <div class="editor-wrapper">
      ${e?d`<div class="loading-overlay"><div class="spinner"></div></div>`:p}
      <div class="editor-header">
        <h2>${this.isNew?"New Schedule":"Edit Schedule"}
          ${this.isNew?p:d`
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
          ${this._confirmDiscard?d`
              <div class="inline-confirm">
                <span>Discard changes?</span>
                <button class="danger" @click=${this._doDiscard}>Yes</button>
                <button class="secondary" @click=${()=>{this._confirmDiscard=!1}}>No</button>
              </div>
            `:d`<button class="secondary" @click=${this._onCancel}>Cancel</button>`}
          ${this.isNew?p:this._confirmDelete?d`
                <div class="inline-confirm">
                  <span>Delete?</span>
                  <button class="danger" @click=${this._doDelete}>Yes</button>
                  <button class="secondary" @click=${()=>{this._confirmDelete=!1}}>No</button>
                </div>
              `:d`<button class="danger" @click=${this._onDelete}>Delete</button>`}
          <button class="primary" ?disabled=${e} @click=${this._onSave}>
            ${this._saving?"Saving...":"Save"}
          </button>
        </div>
      </div>

      ${this._conflicts.length>0?d`
            <div class="warning-banner">
              ⚠ Conflicts detected with:
              ${this._conflicts.map(t=>t.schedule_name).join(", ")}
            </div>
          `:p}

      <div class="form">
        <div class="form-group full-width">
          <label for="name">Name</label>
          <input
            id="name"
            type="text"
            .value=${this._name}
            @input=${t=>{this._name=t.target.value,this._dirty=!0}}
            placeholder="My Schedule"
          />
        </div>

        <div class="form-group">
          <label for="cadence">Cadence</label>
          <div class="cadence-row">
            <select
              id="cadence"
              .value=${this._cadence}
              @change=${t=>{const s=t.target.value;this._cadence=s,this._slots=he(s),this._dirty=!0}}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
            <label class="repeat-check">
              <input
                type="checkbox"
                .checked=${this._repeat}
                @change=${t=>{this._repeat=t.target.checked,this._dirty=!0}}
              />
              Repeat
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>Revert external changes after</label>
          <div class="revert-row">
            <input
              type="number"
              min="0"
              max="59"
              style="width: 60px"
              .value=${this._revertDelay!==null?String(Math.floor(this._revertDelay/60)):"0"}
              ?disabled=${this._revertDelay===null}
              @input=${t=>{const s=parseInt(t.target.value)||0,r=(this._revertDelay??0)%60;this._revertDelay=s*60+r,this._dirty=!0}}
            />
            <span>min</span>
            <input
              type="number"
              min="0"
              max="59"
              style="width: 60px"
              .value=${this._revertDelay!==null?String(this._revertDelay%60):"0"}
              ?disabled=${this._revertDelay===null}
              @input=${t=>{const s=parseInt(t.target.value)||0,r=Math.floor((this._revertDelay??0)/60);this._revertDelay=r*60+s,this._dirty=!0}}
            />
            <span>sec</span>
            <label class="never-label">
              <input
                type="checkbox"
                .checked=${this._revertDelay===null}
                @change=${t=>{this._revertDelay=t.target.checked?null:180,this._dirty=!0}}
              />
              Never
            </label>
          </div>
        </div>

        ${this._cadence==="custom"?d`
              <div class="form-group full-width">
                <div class="date-range-row">
                  <div class="form-group">
                    <label for="start-date">Start Date</label>
                    <input
                      id="start-date"
                      type="date"
                      .value=${this._startDate}
                      @change=${t=>{this._startDate=t.target.value,this._rebuildCustomSlots(),this._dirty=!0}}
                    />
                  </div>
                  <div class="form-group">
                    <label for="end-date">End Date</label>
                    <input
                      id="end-date"
                      type="date"
                      .value=${this._endDate}
                      @change=${t=>{this._endDate=t.target.value,this._rebuildCustomSlots(),this._dirty=!0}}
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
            .showOverrides=${!this.isNew}
            .slotType=${this._slotType}
            @entities-changed=${t=>{this._entityIds=t.detail.entityIds,this._dirty=!0}}
            @override-set=${this._onOverrideSet}
            @override-clear=${this._onOverrideClear}
          ></entity-picker>
        </div>

        <div class="form-group">
          <label for="slot-type">Slot Type</label>
          <select
            id="slot-type"
            .value=${this._slotType}
            @change=${t=>{const s=t.target.value;s!==this._slotType&&(this._slotType=s,this._slots=he(this._cadence),this._cadence==="custom"&&this._rebuildCustomSlots(),this._dirty=!0)}}
          >
            <option value="on_off">On/Off</option>
            <option value="color">Color</option>
          </select>
        </div>

        ${this._slotType==="color"?d`
          <div class="form-group full-width">
            <label>Color Palette</label>
            <div class="palette-editor">
              ${this._palette.map((t,s)=>d`
                <div class="palette-entry">
                  <input
                    type="color"
                    .value=${t}
                    @input=${r=>{const o=[...this._palette];o[s]=r.target.value,this._palette=o,this._dirty=!0}}
                  />
                  ${this._palette.length>1?d`
                    <button class="palette-remove" @click=${()=>{this._palette=this._palette.filter((r,o)=>o!==s),this._dirty=!0}}>✕</button>
                  `:p}
                </div>
              `)}
              ${this._palette.length<10?d`
                <button class="palette-add" @click=${()=>{this._palette=[...this._palette,"#888888"],this._dirty=!0}}>+</button>
              `:p}
            </div>
          </div>
        `:p}
      </div>

      <div class="grid-section">
        <h3>Time Slots (15-minute intervals)</h3>
        <schedule-grid
          .cadence=${this._cadence}
          .slots=${this._slots}
          .customDates=${i}
          .slotType=${this._slotType}
          .palette=${this._palette}
          @slots-changed=${t=>{this._slots=t.detail.slots,this._dirty=!0}}
        ></schedule-grid>
      </div>
      </div>
    `}_rebuildCustomSlots(){if(!this._startDate||!this._endDate)return;const i=De(this._startDate,this._endDate),e={};for(const t of i)e[t]=this._slots[t]??new Array(ce).fill(0);this._slots=e}async _onSave(){var e,t,s,r;if(!this._name.trim()){this._showToast("Name is required","error");return}const i=this._entityIds;if(i.length===0){this._showToast("At least one entity ID is required","error");return}this._saving=!0;try{const o={name:this._name.trim(),entity_ids:i,cadence:this._cadence,repeat:this._repeat,start_date:this._cadence==="custom"&&this._startDate||null,end_date:this._cadence==="custom"&&this._endDate||null,active:this._active,slot_minutes:15,slot_type:this._slotType,slots:this._slots,revert_delay:this._revertDelay};this._slotType==="color"&&(o.palette=this._palette),(e=this.schedule)!=null&&e.id&&(o.id=this.schedule.id);const a=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/save",schedule:o});a.conflicts&&a.conflicts.length>0?this._conflicts=a.conflicts:this._conflicts=[],((t=a.warnings)==null?void 0:t.length)>0&&this._showToast(a.warnings[0],"warning"),this._dirty=!1,this.dispatchEvent(new CustomEvent("schedule-saved",{detail:{id:((s=a.schedule)==null?void 0:s.id)??((r=this.schedule)==null?void 0:r.id)},bubbles:!0,composed:!0}))}catch(o){console.error("Failed to save schedule:",o),this._showToast("Failed to save schedule","error")}finally{this._saving=!1}}_onCancel(){if(this._dirty){this._confirmDiscard=!0;return}this.dispatchEvent(new CustomEvent("editor-cancel",{bubbles:!0,composed:!0}))}_toggleActive(){this._active=!this._active,this._dirty=!0}async _loadOverrides(){var i;if(!((i=this.schedule)!=null&&i.id)){this._overrides={},this._scheduledStates={};return}try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get_overrides",schedule_id:this.schedule.id});this._overrides=e.overrides??{},this._scheduledStates=e.scheduled_states??{}}catch{this._overrides={},this._scheduledStates={}}}async _onOverrideSet(i){var s;if(!((s=this.schedule)!=null&&s.id))return;const{entityId:e,state:t}=i.detail;try{await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/set_override",schedule_id:this.schedule.id,entity_id:e,state:t}),this._overrides={...this._overrides,[e]:t}}catch(r){console.error("Failed to set override:",r),this._showToast("Failed to set override","error")}}async _onOverrideClear(i){var t;if(!((t=this.schedule)!=null&&t.id))return;const{entityId:e}=i.detail;try{await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/clear_override",schedule_id:this.schedule.id,entity_id:e});const s={...this._overrides};delete s[e],this._overrides=s}catch(s){console.error("Failed to clear override:",s),this._showToast("Failed to clear override","error")}}_doDiscard(){this._confirmDiscard=!1,this._dirty=!1,this.dispatchEvent(new CustomEvent("editor-cancel",{bubbles:!0,composed:!0}))}_onDelete(){var i;(i=this.schedule)!=null&&i.id&&(this._confirmDelete=!0)}async _doDelete(){var i;if((i=this.schedule)!=null&&i.id){this._confirmDelete=!1,this._deleting=!0;try{await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/delete",schedule_id:this.schedule.id}),this.dispatchEvent(new CustomEvent("schedule-deleted",{bubbles:!0,composed:!0}))}catch(e){console.error("Failed to delete schedule:",e),this._showToast("Failed to delete schedule","error")}finally{this._deleting=!1}}}};u.styles=[Y,D`
      :host {
        display: block;
        height: 100%;
        overflow-y: auto;
        padding: 16px;
        box-sizing: border-box;
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
      .never-label input[type="checkbox"] {
        width: auto;
      }
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
      .cadence-row {
        display: flex;
        align-items: flex-end;
        gap: 8px;
      }
      .cadence-row select {
        flex: 1;
      }
      .cadence-row .repeat-check {
        display: flex;
        align-items: center;
        gap: 4px;
        padding-bottom: 8px;
        white-space: nowrap;
        font-size: 13px;
      }
      .cadence-row .repeat-check input[type="checkbox"] {
        width: auto;
      }
      .checkbox-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-top: 20px;
      }
      .checkbox-row input[type="checkbox"] {
        width: auto;
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
      .date-range-row .repeat-check input[type="checkbox"] {
        width: auto;
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
      .editor-wrapper {
        position: relative;
      }
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
      .palette-editor {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      .palette-entry {
        position: relative;
        display: inline-flex;
        align-items: center;
      }
      .palette-entry input[type="color"] {
        width: 32px;
        height: 32px;
        padding: 0;
        border: 1px solid var(--ss-border);
        border-radius: 4px;
        cursor: pointer;
        background: none;
      }
      .palette-remove {
        position: absolute;
        top: -6px;
        right: -6px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: none;
        background: var(--error-color, #db4437);
        color: #fff;
        font-size: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
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
    `],g([_({attribute:!1})],u.prototype,"hass",2),g([_({attribute:!1})],u.prototype,"schedule",2),g([_({type:Boolean})],u.prototype,"isNew",2),g([c()],u.prototype,"_name",2),g([c()],u.prototype,"_entityIds",2),g([c()],u.prototype,"_cadence",2),g([c()],u.prototype,"_repeat",2),g([c()],u.prototype,"_startDate",2),g([c()],u.prototype,"_endDate",2),g([c()],u.prototype,"_slots",2),g([c()],u.prototype,"_conflicts",2),g([c()],u.prototype,"_saving",2),g([c()],u.prototype,"_deleting",2),g([c()],u.prototype,"_dirty",2),g([c()],u.prototype,"_confirmDelete",2),g([c()],u.prototype,"_confirmDiscard",2),g([c()],u.prototype,"_active",2),g([c()],u.prototype,"_overrides",2),g([c()],u.prototype,"_scheduledStates",2),g([c()],u.prototype,"_revertDelay",2),g([c()],u.prototype,"_slotType",2),g([c()],u.prototype,"_palette",2),u=g([U("schedule-editor")],u);var pt=Object.defineProperty,ut=Object.getOwnPropertyDescriptor,S=(i,e,t,s)=>{for(var r=s>1?void 0:s?ut(e,t):e,o=i.length-1,a;o>=0;o--)(a=i[o])&&(r=(s?a(e,t,r):a(r))||r);return s&&r&&pt(e,t,r),r};return b.OnCuePanel=class extends x{constructor(){super(...arguments),this.narrow=!1,this._schedules=[],this._selectedSchedule=null,this._isNew=!1,this._loading=!0,this._sidebarOpen=!0}connectedCallback(){super.connectedCallback(),this._loadSchedules()}render(){var e;return this._loading?d`<div class="loading">Loading schedules...</div>`:d`
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
            @schedule-saved=${this._onScheduleSaved}
            @schedule-deleted=${this._onScheduleDeleted}
            @editor-cancel=${this._onEditorCancel}
          ></schedule-editor>
        </div>
      </div>
      ${this.narrow?d`
            <button class="toggle-sidebar" @click=${this._toggleSidebar}>
              ${this._sidebarOpen?"✕":"☰"}
            </button>
          `:p}
    `}async _loadSchedules(){try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/list"});this._schedules=e.schedules??[]}catch(e){console.error("Failed to load schedules:",e),this._schedules=[]}finally{this._loading=!1}}async _onScheduleSelected(e){const t=e.detail.id;try{const s=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get",schedule_id:t});this._selectedSchedule=s.schedule??null,this._isNew=!1}catch(s){console.error("Failed to load schedule:",s)}this.narrow&&(this._sidebarOpen=!1)}_onAddSchedule(){this._selectedSchedule=null,this._isNew=!0,this.narrow&&(this._sidebarOpen=!1)}async _onScheduleSaved(e){var s;await this._loadSchedules();const t=(s=e.detail)==null?void 0:s.id;if(t)try{const r=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get",schedule_id:t});this._selectedSchedule=r.schedule??null,this._isNew=!1}catch{}}async _onScheduleDeleted(){this._selectedSchedule=null,this._isNew=!1,await this._loadSchedules()}_onEditorCancel(){this._isNew&&(this._isNew=!1,this._selectedSchedule=null)}_toggleSidebar(){this._sidebarOpen=!this._sidebarOpen}async _onToggleActive(e){var r;const{id:t,active:s}=e.detail;try{const a=(await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get",schedule_id:t})).schedule;if(!a)return;a.active=s,await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/save",schedule:a}),await this._loadSchedules(),((r=this._selectedSchedule)==null?void 0:r.id)===t&&(this._selectedSchedule={...this._selectedSchedule,active:s})}catch(o){console.error("Failed to toggle schedule active state:",o)}}},b.OnCuePanel.styles=[Y,D`
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
    `],S([_({attribute:!1})],b.OnCuePanel.prototype,"hass",2),S([_({attribute:!1})],b.OnCuePanel.prototype,"panel",2),S([_({type:Boolean})],b.OnCuePanel.prototype,"narrow",2),S([c()],b.OnCuePanel.prototype,"_schedules",2),S([c()],b.OnCuePanel.prototype,"_selectedSchedule",2),S([c()],b.OnCuePanel.prototype,"_isNew",2),S([c()],b.OnCuePanel.prototype,"_loading",2),S([c()],b.OnCuePanel.prototype,"_sidebarOpen",2),b.OnCuePanel=S([U("oncue-scheduler-panel")],b.OnCuePanel),Object.defineProperty(b,Symbol.toStringTag,{value:"Module"}),b}({});
