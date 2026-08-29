var HaOnCueSchedulerPanel=function($){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var De;const J=globalThis,te=J.ShadowRoot&&(J.ShadyCSS===void 0||J.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,se=Symbol(),pe=new WeakMap;let ue=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==se)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(te&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=pe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&pe.set(t,e))}return e}toString(){return this.cssText}};const Oe=s=>new ue(typeof s=="string"?s:s+"",void 0,se),k=(s,...e)=>{const t=s.length===1?s[0]:e.reduce((i,r,o)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[o+1],s[0]);return new ue(t,s,se)},Te=(s,e)=>{if(te)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const i=document.createElement("style"),r=J.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=t.cssText,s.appendChild(i)}},fe=te?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return Oe(t)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Me,defineProperty:ze,getOwnPropertyDescriptor:Re,getOwnPropertyNames:Ie,getOwnPropertySymbols:Ne,getPrototypeOf:Ue}=Object,E=globalThis,_e=E.trustedTypes,je=_e?_e.emptyScript:"",ie=E.reactiveElementPolyfillSupport,H=(s,e)=>s,Z={toAttribute(s,e){switch(e){case Boolean:s=s?je:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},re=(s,e)=>!Me(s,e),ge={attribute:!0,type:String,converter:Z,reflect:!1,useDefault:!1,hasChanged:re};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),E.litPropertyMetadata??(E.litPropertyMetadata=new WeakMap);let R=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ge){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(e,i,t);r!==void 0&&ze(this.prototype,e,r)}}static getPropertyDescriptor(e,t,i){const{get:r,set:o}=Re(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:r,set(a){const l=r==null?void 0:r.call(this);o==null||o.call(this,a),this.requestUpdate(e,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ge}static _$Ei(){if(this.hasOwnProperty(H("elementProperties")))return;const e=Ue(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(H("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(H("properties"))){const t=this.properties,i=[...Ie(t),...Ne(t)];for(const r of i)this.createProperty(r,t[r])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[i,r]of t)this.elementProperties.set(i,r)}this._$Eh=new Map;for(const[t,i]of this.elementProperties){const r=this._$Eu(t,i);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const r of i)t.unshift(fe(r))}else e!==void 0&&t.push(fe(e));return t}static _$Eu(e,t){const i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Te(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var i;return(i=t.hostConnected)==null?void 0:i.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var i;return(i=t.hostDisconnected)==null?void 0:i.call(t)})}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){var o;const i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(r!==void 0&&i.reflect===!0){const a=(((o=i.converter)==null?void 0:o.toAttribute)!==void 0?i.converter:Z).toAttribute(t,i.type);this._$Em=e,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(e,t){var o,a;const i=this.constructor,r=i._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const l=i.getPropertyOptions(r),n=typeof l.converter=="function"?{fromAttribute:l.converter}:((o=l.converter)==null?void 0:o.fromAttribute)!==void 0?l.converter:Z;this._$Em=r;const h=n.fromAttribute(t,l.type);this[r]=h??((a=this._$Ej)==null?void 0:a.get(r))??h,this._$Em=null}}requestUpdate(e,t,i,r=!1,o){var a;if(e!==void 0){const l=this.constructor;if(r===!1&&(o=this[e]),i??(i=l.getPropertyOptions(e)),!((i.hasChanged??re)(o,t)||i.useDefault&&i.reflect&&o===((a=this._$Ej)==null?void 0:a.get(e))&&!this.hasAttribute(l._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:r,wrapped:o},a){i&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,a??t??this[e]),o!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,a]of this._$Ep)this[o]=a;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,a]of r){const{wrapped:l}=a,n=this[o];l!==!0||this._$AL.has(o)||n===void 0||this.C(o,void 0,a,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(i=this._$EO)==null||i.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(i=>{var r;return(r=i.hostUpdated)==null?void 0:r.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};R.elementStyles=[],R.shadowRootOptions={mode:"open"},R[H("elementProperties")]=new Map,R[H("finalized")]=new Map,ie==null||ie({ReactiveElement:R}),(E.reactiveElementVersions??(E.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const L=globalThis,ve=s=>s,X=L.trustedTypes,ye=X?X.createPolicy("lit-html",{createHTML:s=>s}):void 0,be="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,me="?"+P,He=`<${me}>`,D=document,q=()=>D.createComment(""),B=s=>s===null||typeof s!="object"&&typeof s!="function",oe=Array.isArray,Le=s=>oe(s)||typeof(s==null?void 0:s[Symbol.iterator])=="function",ae=`[ 	
\f\r]`,F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$e=/-->/g,xe=/>/g,O=RegExp(`>|${ae}(?:([^\\s"'>=/]+)(${ae}*=${ae}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),we=/'/g,Se=/"/g,Ae=/^(?:script|style|textarea|title)$/i,qe=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),d=qe(1),I=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Ee=new WeakMap,T=D.createTreeWalker(D,129);function Pe(s,e){if(!oe(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return ye!==void 0?ye.createHTML(e):e}const Be=(s,e)=>{const t=s.length-1,i=[];let r,o=e===2?"<svg>":e===3?"<math>":"",a=F;for(let l=0;l<t;l++){const n=s[l];let h,v,f=-1,m=0;for(;m<n.length&&(a.lastIndex=m,v=a.exec(n),v!==null);)m=a.lastIndex,a===F?v[1]==="!--"?a=$e:v[1]!==void 0?a=xe:v[2]!==void 0?(Ae.test(v[2])&&(r=RegExp("</"+v[2],"g")),a=O):v[3]!==void 0&&(a=O):a===O?v[0]===">"?(a=r??F,f=-1):v[1]===void 0?f=-2:(f=a.lastIndex-v[2].length,h=v[1],a=v[3]===void 0?O:v[3]==='"'?Se:we):a===Se||a===we?a=O:a===$e||a===xe?a=F:(a=O,r=void 0);const C=a===O&&s[l+1].startsWith("/>")?" ":"";o+=a===F?n+He:f>=0?(i.push(h),n.slice(0,f)+be+n.slice(f)+P+C):n+P+(f===-2?l:C)}return[Pe(s,o+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]};class V{constructor({strings:e,_$litType$:t},i){let r;this.parts=[];let o=0,a=0;const l=e.length-1,n=this.parts,[h,v]=Be(e,t);if(this.el=V.createElement(h,i),T.currentNode=this.el.content,t===2||t===3){const f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(r=T.nextNode())!==null&&n.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const f of r.getAttributeNames())if(f.endsWith(be)){const m=v[a++],C=r.getAttribute(f).split(P),ee=/([.?@])?(.*)/.exec(m);n.push({type:1,index:o,name:ee[2],strings:C,ctor:ee[1]==="."?Ve:ee[1]==="?"?Ye:ee[1]==="@"?We:G}),r.removeAttribute(f)}else f.startsWith(P)&&(n.push({type:6,index:o}),r.removeAttribute(f));if(Ae.test(r.tagName)){const f=r.textContent.split(P),m=f.length-1;if(m>0){r.textContent=X?X.emptyScript:"";for(let C=0;C<m;C++)r.append(f[C],q()),T.nextNode(),n.push({type:2,index:++o});r.append(f[m],q())}}}else if(r.nodeType===8)if(r.data===me)n.push({type:2,index:o});else{let f=-1;for(;(f=r.data.indexOf(P,f+1))!==-1;)n.push({type:7,index:o}),f+=P.length-1}o++}}static createElement(e,t){const i=D.createElement("template");return i.innerHTML=e,i}}function N(s,e,t=s,i){var a,l;if(e===I)return e;let r=i!==void 0?(a=t._$Co)==null?void 0:a[i]:t._$Cl;const o=B(e)?void 0:e._$litDirective$;return(r==null?void 0:r.constructor)!==o&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),o===void 0?r=void 0:(r=new o(s),r._$AT(s,t,i)),i!==void 0?(t._$Co??(t._$Co=[]))[i]=r:t._$Cl=r),r!==void 0&&(e=N(s,r._$AS(s,e.values),r,i)),e}class Fe{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,r=((e==null?void 0:e.creationScope)??D).importNode(t,!0);T.currentNode=r;let o=T.nextNode(),a=0,l=0,n=i[0];for(;n!==void 0;){if(a===n.index){let h;n.type===2?h=new Y(o,o.nextSibling,this,e):n.type===1?h=new n.ctor(o,n.name,n.strings,this,e):n.type===6&&(h=new Ke(o,this,e)),this._$AV.push(h),n=i[++l]}a!==(n==null?void 0:n.index)&&(o=T.nextNode(),a++)}return T.currentNode=D,r}p(e){let t=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Y{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,i,r){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=N(this,e,t),B(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==I&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Le(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&B(this._$AH)?this._$AA.nextSibling.data=e:this.T(D.createTextNode(e)),this._$AH=e}$(e){var o;const{values:t,_$litType$:i}=e,r=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=V.createElement(Pe(i.h,i.h[0]),this.options)),i);if(((o=this._$AH)==null?void 0:o._$AD)===r)this._$AH.p(t);else{const a=new Fe(r,this),l=a.u(this.options);a.p(t),this.T(l),this._$AH=a}}_$AC(e){let t=Ee.get(e.strings);return t===void 0&&Ee.set(e.strings,t=new V(e)),t}k(e){oe(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,r=0;for(const o of e)r===t.length?t.push(i=new Y(this.O(q()),this.O(q()),this,this.options)):i=t[r],i._$AI(o),r++;r<t.length&&(this._$AR(i&&i._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,t);e!==this._$AB;){const r=ve(e).nextSibling;ve(e).remove(),e=r}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class G{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,r,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=p}_$AI(e,t=this,i,r){const o=this.strings;let a=!1;if(o===void 0)e=N(this,e,t,0),a=!B(e)||e!==this._$AH&&e!==I,a&&(this._$AH=e);else{const l=e;let n,h;for(e=o[0],n=0;n<o.length-1;n++)h=N(this,l[i+n],t,n),h===I&&(h=this._$AH[n]),a||(a=!B(h)||h!==this._$AH[n]),h===p?e=p:e!==p&&(e+=(h??"")+o[n+1]),this._$AH[n]=h}a&&!r&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Ve extends G{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}}class Ye extends G{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}}class We extends G{constructor(e,t,i,r,o){super(e,t,i,r,o),this.type=5}_$AI(e,t=this){if((e=N(this,e,t,0)??p)===I)return;const i=this._$AH,r=e===p&&i!==p||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==p&&(i===p||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Ke{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){N(this,e)}}const ne=L.litHtmlPolyfillSupport;ne==null||ne(V,Y),(L.litHtmlVersions??(L.litHtmlVersions=[])).push("3.3.3");const Je=(s,e,t)=>{const i=(t==null?void 0:t.renderBefore)??e;let r=i._$litPart$;if(r===void 0){const o=(t==null?void 0:t.renderBefore)??null;i._$litPart$=r=new Y(e.insertBefore(q(),o),o,void 0,t??{})}return r._$AI(s),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const M=globalThis;class w extends R{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Je(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return I}}w._$litElement$=!0,w.finalized=!0,(De=M.litElementHydrateSupport)==null||De.call(M,{LitElement:w});const le=M.litElementPolyfillSupport;le==null||le({LitElement:w}),(M.litElementVersions??(M.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const U=s=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(s,e)}):customElements.define(s,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ze={attribute:!0,type:String,converter:Z,reflect:!1,hasChanged:re},Xe=(s=Ze,e,t)=>{const{kind:i,metadata:r}=t;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),i==="setter"&&((s=Object.create(s)).wrapped=!0),o.set(t.name,s),i==="accessor"){const{name:a}=t;return{set(l){const n=e.get.call(this);e.set.call(this,l),this.requestUpdate(a,n,s,!0,l)},init(l){return l!==void 0&&this.C(a,void 0,s,l),l}}}if(i==="setter"){const{name:a}=t;return function(l){const n=this[a];e.call(this,l),this.requestUpdate(a,n,s,!0,l)}}throw Error("Unsupported decorator location: "+i)};function _(s){return(e,t)=>typeof t=="object"?Xe(s,e,t):((i,r,o)=>{const a=r.hasOwnProperty(o);return r.constructor.createProperty(o,i),a?Object.getOwnPropertyDescriptor(r,o):void 0})(s,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function c(s){return _({...s,state:!0,attribute:!1})}const W=k`
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
`;var Ge=Object.defineProperty,Qe=Object.getOwnPropertyDescriptor,de=(s,e,t,i)=>{for(var r=i>1?void 0:i?Qe(e,t):e,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(e,t,r):a(r))||r);return i&&r&&Ge(e,t,r),r};let K=class extends w{constructor(){super(...arguments),this.schedules=[],this.selectedId=null}render(){return d`
      <div class="header">
        <h2>Schedules</h2>
        <button class="primary" @click=${this._onAdd}>+ Add</button>
      </div>
      <div class="list">
        ${this.schedules.length===0?d`<div class="empty">No schedules yet. Click + Add to create one.</div>`:this.schedules.map(s=>d`
                <div
                  class="item ${s.id===this.selectedId?"selected":""}"
                  @click=${()=>this._onSelect(s.id)}
                >
                  <div
                    class="status-dot ${s.active?"active":"paused"}"
                    title=${s.active?"Active":"Paused"}
                  ></div>
                  <div class="item-info">
                    <div class="item-name">${s.name}</div>
                    <div class="item-meta">
                      <span class="badge badge-${s.cadence}">${s.cadence}</span>
                      ${s.entity_ids.length} ${s.entity_ids.length!==1?"entities":"entity"}
                    </div>
                  </div>
                  <button
                    class="toggle-btn"
                    title=${s.active?"Pause schedule":"Resume schedule"}
                    @click=${e=>{e.stopPropagation(),this._onToggleActive(s.id,!s.active)}}
                  >${s.active?"Pause":"Resume"}</button>
                </div>
              `)}
      </div>
    `}_onSelect(s){this.dispatchEvent(new CustomEvent("schedule-selected",{detail:{id:s},bubbles:!0,composed:!0}))}_onAdd(){this.dispatchEvent(new CustomEvent("schedule-add",{bubbles:!0,composed:!0}))}_onToggleActive(s,e){this.dispatchEvent(new CustomEvent("schedule-toggle-active",{detail:{id:s,active:e},bubbles:!0,composed:!0}))}};K.styles=[W,k`
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
    `],de([_({type:Array})],K.prototype,"schedules",2),de([_({type:String})],K.prototype,"selectedId",2),K=de([U("schedule-list")],K);var et=Object.defineProperty,tt=Object.getOwnPropertyDescriptor,b=(s,e,t,i)=>{for(var r=i>1?void 0:i?tt(e,t):e,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(e,t,r):a(r))||r);return i&&r&&et(e,t,r),r};const z=96,st=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],Ce=["0","1","2","3","4","5","6"];let y=class extends w{constructor(){super(...arguments),this.cadence="daily",this.slots={},this.customDates=[],this.slotType="on_off",this.palette=[],this._dragActive=!1,this._dragValue=0,this._dragStartRow=-1,this._dragStartCol=-1,this._dragEndRow=-1,this._dragEndCol=-1,this._page=0,this._activePaletteIndex=1,this._nowMinutes=y._currentMinutes(),this._timeIndicatorLeft=null,this._daysPerPage=56,this._timerHandle=null}static _currentMinutes(){const s=new Date;return s.getHours()*60+s.getMinutes()}connectedCallback(){super.connectedCallback(),this._timerHandle=setInterval(()=>{this._nowMinutes=y._currentMinutes()},3e4)}disconnectedCallback(){super.disconnectedCallback(),this._timerHandle!==null&&(clearInterval(this._timerHandle),this._timerHandle=null)}updated(s){super.updated(s),(s.has("_nowMinutes")||s.has("slots")||s.has("cadence"))&&requestAnimationFrame(()=>this._updateTimeIndicatorPosition())}_updateTimeIndicatorPosition(){var l,n;const s=(l=this.shadowRoot)==null?void 0:l.querySelector(".grid"),e=(n=this.shadowRoot)==null?void 0:n.querySelector(".grid-wrapper");if(!s||!e)return;const t=Math.floor(this._nowMinutes/15),i=this._nowMinutes%15/15,r=s.querySelector(`[data-col="${t}"]`);if(!r)return;const o=e.getBoundingClientRect(),a=r.getBoundingClientRect();this._timeIndicatorLeft=a.left-o.left+a.width*i}get _dayKeys(){if(this.cadence==="daily")return["0"];if(this.cadence==="weekly")return Ce;const s=this.customDates;if(s.length<=this._daysPerPage)return s;const e=this._page*this._daysPerPage;return s.slice(e,e+this._daysPerPage)}get _totalPages(){return this.cadence!=="custom"?1:Math.max(1,Math.ceil(this.customDates.length/this._daysPerPage))}_renderLabel(s){if(this.cadence!=="custom")return this._dayLabel(s);const e=new Date(s+"T00:00:00"),t=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][e.getDay()];return d`<span class="day-name">${t}</span><span class="day-date">${s}</span>`}_dayLabel(s){if(this.cadence==="daily")return"Every day";if(this.cadence==="weekly")return st[parseInt(s)]??s;const e=new Date(s+"T00:00:00");return`${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][e.getDay()]} ${s}`}render(){const s=this._dayKeys,e=Array.from({length:24},(i,r)=>r),t=this.slotType==="color";return d`
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
        <div class="grid-wrapper">
          ${this._renderTimeIndicator()}
          <div class="grid" @mouseup=${this._onMouseUp} @mouseleave=${this._onMouseUp}>
          <!-- hour headers -->
          <div class="header-spacer"></div>
          ${e.map(i=>d`
              <div class="header-cell" style="grid-column: span 4">${String(i).padStart(2,"0")}</div>
            `)}

          <!-- rows -->
          ${s.map((i,r)=>this._renderRow(i,r))}
          </div>
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
    `}_weekIndex(s){if(this.cadence!=="custom")return 0;const e=new Date(s+"T00:00:00"),t=this.customDates;if(t.length===0)return 0;const i=new Date(t[0]+"T00:00:00"),r=new Date(i);r.setDate(i.getDate()-i.getDay());const o=Math.floor((e.getTime()-r.getTime())/864e5);return Math.floor(o/7)}_rowTemporalState(s){const e=new Date;if(this.cadence==="weekly"){const t=String((e.getDay()+6)%7);return s===t?"today":"other"}if(this.cadence==="custom"){const t=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`;return s===t?"today":s<t?"past":"other"}return"other"}_renderRow(s,e){const t=this.slots[s]??new Array(z).fill(0),i=this.slotType==="color",r=this.cadence==="custom"&&this._weekIndex(s)%2===1,o=this._rowTemporalState(s),a=o==="today",l=o==="past";return d`
      <div class="row-label ${r?"week-even":""} ${a?"today-row":""} ${l?"past-row":""}">${this._renderLabel(s)}</div>
      ${t.map((n,h)=>{const v=this._isInDragRegion(e,h),f=i?this._colorCellStyle(n):"";return d`
          <div
            class="cell ${i?n?"color-set":"off":n?"on":"off"} ${r&&!n?"week-even":""} ${a?"today-row":""} ${l?"past-row":""} ${v?"drag-preview":""} ${h%4===0?"hour-start":""}"
            style=${f}
            data-row=${e}
            data-col=${h}
            data-day=${s}
            title="${this._cellTooltip(h)}"
            @mousedown=${m=>this._onMouseDown(m,e,h,s)}
            @mouseenter=${m=>this._onMouseEnter(m,e,h)}
            @touchstart=${m=>this._onTouchStart(m,e,h,s)}
            @touchmove=${this._onTouchMove}
            @touchend=${this._onTouchEnd}
          ></div>
        `})}
    `}_cellTooltip(s){const e=Math.floor(s*15/60),t=s*15%60,i=Math.floor((s+1)*15/60),r=(s+1)*15%60;return`${String(e).padStart(2,"0")}:${String(t).padStart(2,"0")} – ${String(i).padStart(2,"0")}:${String(r).padStart(2,"0")}`}_colorCellStyle(s){return s===0||!this.palette||s>this.palette.length?"":`background: ${this.palette[s-1]}`}_renderPaletteBar(){return d`
      <div class="palette-bar">
        <span>Paint:</span>
        <div
          class="palette-swatch eraser ${this._activePaletteIndex===0?"active":""}"
          title="Eraser"
          @click=${()=>{this._activePaletteIndex=0}}
        >✕</div>
        ${this.palette.map((s,e)=>d`
          <div
            class="palette-swatch ${this._activePaletteIndex===e+1?"active":""}"
            style="background: ${s}"
            title="${s}"
            @click=${()=>{this._activePaletteIndex=e+1}}
          ></div>
        `)}
      </div>
    `}_renderTimeIndicator(){if(this._timeIndicatorLeft===null)return p;const s=Math.floor(this._nowMinutes/60),e=this._nowMinutes%60,t=`${String(s).padStart(2,"0")}:${String(e).padStart(2,"0")}`,i=`${this._timeIndicatorLeft}px`;return d`
      <span class="time-label top" style="left: ${i}">${t}</span>
      <div class="time-indicator" style="left: ${i}"></div>
      <span class="time-label bottom" style="left: ${i}">${t}</span>
    `}_isInDragRegion(s,e){if(!this._dragActive)return!1;const t=Math.min(this._dragStartRow,this._dragEndRow),i=Math.max(this._dragStartRow,this._dragEndRow),r=Math.min(this._dragStartCol,this._dragEndCol),o=Math.max(this._dragStartCol,this._dragEndCol);return s>=t&&s<=i&&e>=r&&e<=o}_onMouseDown(s,e,t,i){s.preventDefault();const r=this.slots[i]??new Array(z).fill(0);this.slotType==="color"?this._dragValue=r[t]===this._activePaletteIndex?0:this._activePaletteIndex:this._dragValue=r[t]?0:1,this._dragStartRow=e,this._dragStartCol=t,this._dragEndRow=e,this._dragEndCol=t,this._dragActive=!0}_onMouseEnter(s,e,t){this._dragActive&&(this._dragEndRow=e,this._dragEndCol=t)}_onMouseUp(){this._dragActive&&(this._applyDrag(),this._dragActive=!1)}_onTouchStart(s,e,t,i){s.preventDefault();const r=this.slots[i]??new Array(z).fill(0);this.slotType==="color"?this._dragValue=r[t]===this._activePaletteIndex?0:this._activePaletteIndex:this._dragValue=r[t]?0:1,this._dragStartRow=e,this._dragStartCol=t,this._dragEndRow=e,this._dragEndCol=t,this._dragActive=!0}_onTouchMove(s){var i;if(!this._dragActive)return;const e=s.touches[0],t=(i=this.shadowRoot)==null?void 0:i.elementFromPoint(e.clientX,e.clientY);(t==null?void 0:t.dataset.row)!==void 0&&(t==null?void 0:t.dataset.col)!==void 0&&(this._dragEndRow=parseInt(t.dataset.row),this._dragEndCol=parseInt(t.dataset.col))}_onTouchEnd(){this._dragActive&&(this._applyDrag(),this._dragActive=!1)}_applyDrag(){const s=this._dayKeys,e=Math.min(this._dragStartRow,this._dragEndRow),t=Math.max(this._dragStartRow,this._dragEndRow),i=Math.min(this._dragStartCol,this._dragEndCol),r=Math.max(this._dragStartCol,this._dragEndCol),o={...this.slots};for(let a=e;a<=t;a++){const l=s[a];if(!l)continue;const n=[...o[l]??new Array(z).fill(0)];for(let h=i;h<=r;h++)n[h]=this._dragValue;o[l]=n}this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:o},bubbles:!0,composed:!0}))}_bulkSet(s){const e=this.cadence==="custom"?this.customDates:this._dayKeys,t={};for(const i of e)t[i]=new Array(z).fill(s);this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:t},bubbles:!0,composed:!0}))}_copyMondayToAll(){const s=this.slots[0]??new Array(z).fill(0),e={};for(const t of Ce)e[t]=[...s];this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:e},bubbles:!0,composed:!0}))}_prevPage(){this._page=Math.max(0,this._page-1)}_nextPage(){this._page=Math.min(this._totalPages-1,this._page+1)}};y.styles=[W,k`
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
    `],b([_({type:String})],y.prototype,"cadence",2),b([_({type:Object})],y.prototype,"slots",2),b([_({type:Array})],y.prototype,"customDates",2),b([_({type:String})],y.prototype,"slotType",2),b([_({type:Array})],y.prototype,"palette",2),b([c()],y.prototype,"_dragActive",2),b([c()],y.prototype,"_dragValue",2),b([c()],y.prototype,"_dragStartRow",2),b([c()],y.prototype,"_dragStartCol",2),b([c()],y.prototype,"_dragEndRow",2),b([c()],y.prototype,"_dragEndCol",2),b([c()],y.prototype,"_page",2),b([c()],y.prototype,"_activePaletteIndex",2),b([c()],y.prototype,"_nowMinutes",2),b([c()],y.prototype,"_timeIndicatorLeft",2),y=b([U("schedule-grid")],y);var it=Object.defineProperty,rt=Object.getOwnPropertyDescriptor,S=(s,e,t,i)=>{for(var r=i>1?void 0:i?rt(e,t):e,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(e,t,r):a(r))||r);return i&&r&&it(e,t,r),r};const ot=["switch","light","fan","input_boolean"],at=["rgb","rgbw","rgbww","hs","xy"];let x=class extends w{constructor(){super(...arguments),this.slotType="on_off",this.selectedIds=[],this.overrides={},this.scheduledStates={},this.unavailableEntities=[],this.showOverrides=!1,this._query="",this._open=!1}get _availableEntities(){var t;if(!((t=this.hass)!=null&&t.states))return[];const s=new Set(this.selectedIds),e=this.slotType==="color";return Object.keys(this.hass.states).filter(i=>{var o,a;if(s.has(i))return!1;const r=i.split(".")[0];if(e){if(r!=="light")return!1;const l=(a=(o=this.hass.states[i])==null?void 0:o.attributes)==null?void 0:a.supported_color_modes;return Array.isArray(l)&&l.some(n=>at.includes(n))}return ot.includes(r)}).map(i=>{var r,o;return{id:i,name:((o=(r=this.hass.states[i])==null?void 0:r.attributes)==null?void 0:o.friendly_name)??i}}).sort((i,r)=>i.id.localeCompare(r.id))}get _filtered(){const s=this._query.toLowerCase();return s?this._availableEntities.filter(e=>e.id.toLowerCase().includes(s)||e.name.toLowerCase().includes(s)):this._availableEntities}render(){return d`
      <div class="entity-list">
        ${this.selectedIds.map(s=>this._renderEntityRow(s))}
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
    `}_renderEntityRow(s){var n,h,v;const e=this.overrides[s],t=this.scheduledStates[s],i=((v=(h=(n=this.hass)==null?void 0:n.states)==null?void 0:h[s])==null?void 0:v.state)==="on"?"on":"off",r=this.unavailableEntities.includes(s);let o="";r?o="unavailable":this.showOverrides&&e&&(o=e===t?"override-match":"override-conflict");const a=e==="on"?"active-on":!e&&this.showOverrides&&i==="on"?"current-state":"",l=e==="off"?"active-off":!e&&this.showOverrides&&i==="off"?"current-state":"";return d`
      <div class="entity-row ${o}">
        <span class="entity-name">
          <ha-icon .icon=${this._entityIcon(s)??""}
            style="visibility: ${this._entityIcon(s)?"visible":"hidden"}"
          ></ha-icon>
          ${this._friendlyName(s)}
          <span class="entity-id">${s}</span>
        </span>
        ${r?d`<span class="unavailable-badge">unavailable</span>`:p}
        ${this.showOverrides&&this.slotType!=="color"?d`
          <span class="override-controls">
            <button
              class="override-btn ${a}"
              title="Override On"
              @click=${()=>this._onOverride(s,"on")}
            >On</button>
            <button
              class="override-btn ${l}"
              title="Override Off"
              @click=${()=>this._onOverride(s,"off")}
            >Off</button>
          </span>
        `:p}
        <button class="entity-remove" @click=${()=>this._remove(s)}>✕</button>
      </div>
    `}_renderDropdown(){const s=this._filtered;return s.length===0?d`<div class="dropdown"><div class="no-results">No matching entities</div></div>`:d`
      <div class="dropdown">
        ${s.map(e=>d`
            <div class="option" @mousedown=${t=>{t.preventDefault(),this._select(e.id)}}>
              <span class="option-id">${e.id}</span>
              <span class="option-name">${e.name}</span>
            </div>
          `)}
      </div>
    `}_friendlyName(s){var e,t,i,r;return((r=(i=(t=(e=this.hass)==null?void 0:e.states)==null?void 0:t[s])==null?void 0:i.attributes)==null?void 0:r.friendly_name)??s}_entityIcon(s){var e,t,i,r;return(r=(i=(t=(e=this.hass)==null?void 0:e.states)==null?void 0:t[s])==null?void 0:i.attributes)==null?void 0:r.icon}_onInput(s){this._query=s.target.value,this._open=!0}_onBlur(){setTimeout(()=>{this._open=!1},150)}_select(s){const e=[...this.selectedIds,s];this._query="",this._fireChanged(e)}_remove(s){const e=this.selectedIds.filter(t=>t!==s);this._fireChanged(e)}_onOverride(s,e){this.overrides[s]===e?this.dispatchEvent(new CustomEvent("override-clear",{detail:{entityId:s},bubbles:!0,composed:!0})):this.dispatchEvent(new CustomEvent("override-set",{detail:{entityId:s,state:e},bubbles:!0,composed:!0}))}_fireChanged(s){this.dispatchEvent(new CustomEvent("entities-changed",{detail:{entityIds:s},bubbles:!0,composed:!0}))}};x.styles=[W,k`
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
    `],S([_({attribute:!1})],x.prototype,"hass",2),S([_({type:String})],x.prototype,"slotType",2),S([_({type:Array})],x.prototype,"selectedIds",2),S([_({type:Object})],x.prototype,"overrides",2),S([_({type:Object})],x.prototype,"scheduledStates",2),S([_({type:Array})],x.prototype,"unavailableEntities",2),S([_({type:Boolean})],x.prototype,"showOverrides",2),S([c()],x.prototype,"_query",2),S([c()],x.prototype,"_open",2),x=S([U("entity-picker")],x);var nt=Object.defineProperty,lt=Object.getOwnPropertyDescriptor,Q=(s,e,t,i)=>{for(var r=i>1?void 0:i?lt(e,t):e,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(e,t,r):a(r))||r);return i&&r&&nt(e,t,r),r};let j=class extends w{constructor(){super(...arguments),this.message="",this.type="info",this.visible=!1,this._timer=null}render(){return d`
      <div class="toast ${this.type}" @click=${this.dismiss}>
        ${this.message}
      </div>
    `}show(s,e="info"){this._timer&&clearTimeout(this._timer),this.message=s,this.type=e,this.visible=!0,this._timer=setTimeout(()=>this.dismiss(),5e3)}dismiss(){this.visible=!1,this._timer&&(clearTimeout(this._timer),this._timer=null)}};j.styles=k`
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
  `,Q([_({type:String})],j.prototype,"message",2),Q([_({type:String})],j.prototype,"type",2),Q([_({type:Boolean,reflect:!0})],j.prototype,"visible",2),j=Q([U("toast-notification")],j);var dt=Object.defineProperty,ct=Object.getOwnPropertyDescriptor,g=(s,e,t,i)=>{for(var r=i>1?void 0:i?ct(e,t):e,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(e,t,r):a(r))||r);return i&&r&&dt(e,t,r),r};const ce=96,ht=["0","1","2","3","4","5","6"];function he(s){if(s==="daily")return{0:new Array(ce).fill(0)};if(s==="weekly"){const e={};for(const t of ht)e[t]=new Array(ce).fill(0);return e}return{}}function ke(s,e){const t=[],i=new Date(s),r=new Date(e);for(;i<=r;)t.push(i.toISOString().slice(0,10)),i.setDate(i.getDate()+1);return t}let u=class extends w{constructor(){super(...arguments),this.schedule=null,this.isNew=!1,this._name="",this._entityIds=[],this._cadence="daily",this._repeat=!0,this._startDate="",this._endDate="",this._slots={},this._conflicts=[],this._saving=!1,this._deleting=!1,this._dirty=!1,this._confirmDelete=!1,this._confirmDiscard=!1,this._active=!0,this._overrides={},this._scheduledStates={},this._unavailableEntities=[],this._revertDelay=180,this._slotType="on_off",this._palette=["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ff8800","#ffffff"]}willUpdate(s){s.has("schedule")&&(this._loadFromSchedule(),this._confirmDelete=!1,this._confirmDiscard=!1,this._loadOverrides())}get _toast(){return this.renderRoot.querySelector("toast-notification")}_showToast(s,e="info"){var t;(t=this._toast)==null||t.show(s,e)}_loadFromSchedule(){this.schedule?(this._name=this.schedule.name,this._entityIds=[...this.schedule.entity_ids],this._cadence=this.schedule.cadence,this._repeat=this.schedule.repeat,this._startDate=this.schedule.start_date??"",this._endDate=this.schedule.end_date??"",this._slots=JSON.parse(JSON.stringify(this.schedule.slots)),this._active=this.schedule.active,this._revertDelay="revert_delay"in this.schedule?this.schedule.revert_delay:180,this._slotType=this.schedule.slot_type??"on_off",this._palette=this.schedule.palette?[...this.schedule.palette]:["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ff8800","#ffffff"]):(this._name="",this._entityIds=[],this._cadence="daily",this._repeat=!0,this._startDate="",this._endDate="",this._slots=he("daily"),this._active=!0,this._revertDelay=180,this._slotType="on_off",this._palette=["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ff8800","#ffffff"]),this._dirty=!1,this._conflicts=[]}render(){if(!this.schedule&&!this.isNew)return d`<div class="empty-msg">Select a schedule or create a new one.</div>`;const s=this._cadence==="custom"&&this._startDate&&this._endDate?ke(this._startDate,this._endDate):[],e=this._saving||this._deleting;return d`
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
              @change=${t=>{const i=t.target.value;this._cadence=i,this._slots=he(i),this._dirty=!0}}
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
              @input=${t=>{const i=parseInt(t.target.value)||0,r=(this._revertDelay??0)%60;this._revertDelay=i*60+r,this._dirty=!0}}
            />
            <span>min</span>
            <input
              type="number"
              min="0"
              max="59"
              style="width: 60px"
              .value=${this._revertDelay!==null?String(this._revertDelay%60):"0"}
              ?disabled=${this._revertDelay===null}
              @input=${t=>{const i=parseInt(t.target.value)||0,r=Math.floor((this._revertDelay??0)/60);this._revertDelay=r*60+i,this._dirty=!0}}
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
            .unavailableEntities=${this._unavailableEntities}
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
            @change=${t=>{const i=t.target.value;i!==this._slotType&&(this._slotType=i,this._slots=he(this._cadence),this._cadence==="custom"&&this._rebuildCustomSlots(),this._dirty=!0)}}
          >
            <option value="on_off">On/Off</option>
            <option value="color">Color</option>
          </select>
        </div>

        ${this._slotType==="color"?d`
          <div class="form-group full-width">
            <label>Color Palette</label>
            <div class="palette-editor">
              ${this._palette.map((t,i)=>d`
                <div class="palette-entry">
                  <input
                    type="color"
                    .value=${t}
                    @input=${r=>{const o=[...this._palette];o[i]=r.target.value,this._palette=o,this._dirty=!0}}
                  />
                  ${this._palette.length>1?d`
                    <button class="palette-remove" @click=${()=>{this._palette=this._palette.filter((r,o)=>o!==i),this._dirty=!0}}>✕</button>
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
          .customDates=${s}
          .slotType=${this._slotType}
          .palette=${this._palette}
          @slots-changed=${t=>{this._slots=t.detail.slots,this._dirty=!0}}
        ></schedule-grid>
      </div>
      </div>
    `}_rebuildCustomSlots(){if(!this._startDate||!this._endDate)return;const s=ke(this._startDate,this._endDate),e={};for(const t of s)e[t]=this._slots[t]??new Array(ce).fill(0);this._slots=e}async _onSave(){var e,t,i,r;if(!this._name.trim()){this._showToast("Name is required","error");return}const s=this._entityIds;if(s.length===0){this._showToast("At least one entity ID is required","error");return}this._saving=!0;try{const o={name:this._name.trim(),entity_ids:s,cadence:this._cadence,repeat:this._repeat,start_date:this._cadence==="custom"&&this._startDate||null,end_date:this._cadence==="custom"&&this._endDate||null,active:this._active,slot_minutes:15,slot_type:this._slotType,slots:this._slots,revert_delay:this._revertDelay};this._slotType==="color"&&(o.palette=this._palette),(e=this.schedule)!=null&&e.id&&(o.id=this.schedule.id);const a=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/save",schedule:o});a.conflicts&&a.conflicts.length>0?this._conflicts=a.conflicts:this._conflicts=[],((t=a.warnings)==null?void 0:t.length)>0&&this._showToast(a.warnings[0],"warning"),this._dirty=!1,this.dispatchEvent(new CustomEvent("schedule-saved",{detail:{id:((i=a.schedule)==null?void 0:i.id)??((r=this.schedule)==null?void 0:r.id)},bubbles:!0,composed:!0}))}catch(o){console.error("Failed to save schedule:",o),this._showToast("Failed to save schedule","error")}finally{this._saving=!1}}_onCancel(){if(this._dirty){this._confirmDiscard=!0;return}this.dispatchEvent(new CustomEvent("editor-cancel",{bubbles:!0,composed:!0}))}_toggleActive(){this._active=!this._active,this._dirty=!0}async _loadOverrides(){var s;if(!((s=this.schedule)!=null&&s.id)){this._overrides={},this._scheduledStates={},this._unavailableEntities=[];return}try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get_overrides",schedule_id:this.schedule.id});this._overrides=e.overrides??{},this._scheduledStates=e.scheduled_states??{},this._unavailableEntities=e.unavailable_entities??[]}catch{this._overrides={},this._scheduledStates={},this._unavailableEntities=[]}}async _onOverrideSet(s){var i;if(!((i=this.schedule)!=null&&i.id))return;const{entityId:e,state:t}=s.detail;try{await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/set_override",schedule_id:this.schedule.id,entity_id:e,state:t}),this._overrides={...this._overrides,[e]:t}}catch(r){console.error("Failed to set override:",r),this._showToast("Failed to set override","error")}}async _onOverrideClear(s){var t;if(!((t=this.schedule)!=null&&t.id))return;const{entityId:e}=s.detail;try{await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/clear_override",schedule_id:this.schedule.id,entity_id:e});const i={...this._overrides};delete i[e],this._overrides=i}catch(i){console.error("Failed to clear override:",i),this._showToast("Failed to clear override","error")}}_doDiscard(){this._confirmDiscard=!1,this._dirty=!1,this.dispatchEvent(new CustomEvent("editor-cancel",{bubbles:!0,composed:!0}))}_onDelete(){var s;(s=this.schedule)!=null&&s.id&&(this._confirmDelete=!0)}async _doDelete(){var s;if((s=this.schedule)!=null&&s.id){this._confirmDelete=!1,this._deleting=!0;try{await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/delete",schedule_id:this.schedule.id}),this.dispatchEvent(new CustomEvent("schedule-deleted",{bubbles:!0,composed:!0}))}catch(e){console.error("Failed to delete schedule:",e),this._showToast("Failed to delete schedule","error")}finally{this._deleting=!1}}}};u.styles=[W,k`
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
    `],g([_({attribute:!1})],u.prototype,"hass",2),g([_({attribute:!1})],u.prototype,"schedule",2),g([_({type:Boolean})],u.prototype,"isNew",2),g([c()],u.prototype,"_name",2),g([c()],u.prototype,"_entityIds",2),g([c()],u.prototype,"_cadence",2),g([c()],u.prototype,"_repeat",2),g([c()],u.prototype,"_startDate",2),g([c()],u.prototype,"_endDate",2),g([c()],u.prototype,"_slots",2),g([c()],u.prototype,"_conflicts",2),g([c()],u.prototype,"_saving",2),g([c()],u.prototype,"_deleting",2),g([c()],u.prototype,"_dirty",2),g([c()],u.prototype,"_confirmDelete",2),g([c()],u.prototype,"_confirmDiscard",2),g([c()],u.prototype,"_active",2),g([c()],u.prototype,"_overrides",2),g([c()],u.prototype,"_scheduledStates",2),g([c()],u.prototype,"_unavailableEntities",2),g([c()],u.prototype,"_revertDelay",2),g([c()],u.prototype,"_slotType",2),g([c()],u.prototype,"_palette",2),u=g([U("schedule-editor")],u);var pt=Object.defineProperty,ut=Object.getOwnPropertyDescriptor,A=(s,e,t,i)=>{for(var r=i>1?void 0:i?ut(e,t):e,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(e,t,r):a(r))||r);return i&&r&&pt(e,t,r),r};return $.OnCuePanel=class extends w{constructor(){super(...arguments),this.narrow=!1,this._schedules=[],this._selectedSchedule=null,this._isNew=!1,this._loading=!0,this._sidebarOpen=!0}connectedCallback(){super.connectedCallback(),this._loadSchedules()}render(){var e;return this._loading?d`<div class="loading">Loading schedules...</div>`:d`
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
    `}async _loadSchedules(){try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/list"});this._schedules=e.schedules??[]}catch(e){console.error("Failed to load schedules:",e),this._schedules=[]}finally{this._loading=!1}}async _onScheduleSelected(e){const t=e.detail.id;try{const i=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get",schedule_id:t});this._selectedSchedule=i.schedule??null,this._isNew=!1}catch(i){console.error("Failed to load schedule:",i)}this.narrow&&(this._sidebarOpen=!1)}_onAddSchedule(){this._selectedSchedule=null,this._isNew=!0,this.narrow&&(this._sidebarOpen=!1)}async _onScheduleSaved(e){var i;await this._loadSchedules();const t=(i=e.detail)==null?void 0:i.id;if(t)try{const r=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get",schedule_id:t});this._selectedSchedule=r.schedule??null,this._isNew=!1}catch{}}async _onScheduleDeleted(){this._selectedSchedule=null,this._isNew=!1,await this._loadSchedules()}_onEditorCancel(){this._isNew&&(this._isNew=!1,this._selectedSchedule=null)}_toggleSidebar(){this._sidebarOpen=!this._sidebarOpen}async _onToggleActive(e){var r;const{id:t,active:i}=e.detail;try{const a=(await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get",schedule_id:t})).schedule;if(!a)return;a.active=i,await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/save",schedule:a}),await this._loadSchedules(),((r=this._selectedSchedule)==null?void 0:r.id)===t&&(this._selectedSchedule={...this._selectedSchedule,active:i})}catch(o){console.error("Failed to toggle schedule active state:",o)}}},$.OnCuePanel.styles=[W,k`
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
    `],A([_({attribute:!1})],$.OnCuePanel.prototype,"hass",2),A([_({attribute:!1})],$.OnCuePanel.prototype,"panel",2),A([_({type:Boolean})],$.OnCuePanel.prototype,"narrow",2),A([c()],$.OnCuePanel.prototype,"_schedules",2),A([c()],$.OnCuePanel.prototype,"_selectedSchedule",2),A([c()],$.OnCuePanel.prototype,"_isNew",2),A([c()],$.OnCuePanel.prototype,"_loading",2),A([c()],$.OnCuePanel.prototype,"_sidebarOpen",2),$.OnCuePanel=A([U("oncue-scheduler-panel")],$.OnCuePanel),Object.defineProperty($,Symbol.toStringTag,{value:"Module"}),$}({});
