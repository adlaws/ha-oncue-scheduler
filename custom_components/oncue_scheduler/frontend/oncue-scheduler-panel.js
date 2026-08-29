var HaOnCueSchedulerPanel=function($){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Fe;const te=globalThis,ce=te.ShadowRoot&&(te.ShadyCSS===void 0||te.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,de=Symbol(),we=new WeakMap;let Pe=class{constructor(e,s,i){if(this._$cssResult$=!0,i!==de)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=s}get styleSheet(){let e=this.o;const s=this.t;if(ce&&e===void 0){const i=s!==void 0&&s.length===1;i&&(e=we.get(s)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&we.set(s,e))}return e}toString(){return this.cssText}};const qe=t=>new Pe(typeof t=="string"?t:t+"",void 0,de),k=(t,...e)=>{const s=t.length===1?t[0]:e.reduce((i,o,r)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+t[r+1],t[0]);return new Pe(s,t,de)},Ve=(t,e)=>{if(ce)t.adoptedStyleSheets=e.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(const s of e){const i=document.createElement("style"),o=te.litNonce;o!==void 0&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}},Se=ce?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let s="";for(const i of e.cssRules)s+=i.cssText;return qe(s)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Be,defineProperty:Ke,getOwnPropertyDescriptor:Ye,getOwnPropertyNames:We,getOwnPropertySymbols:Ze,getPrototypeOf:Xe}=Object,T=globalThis,Ce=T.trustedTypes,Qe=Ce?Ce.emptyScript:"",he=T.reactiveElementPolyfillSupport,B=(t,e)=>t,se={toAttribute(t,e){switch(e){case Boolean:t=t?Qe:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=t!==null;break;case Number:s=t===null?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch{s=null}}return s}},pe=(t,e)=>!Be(t,e),Ee={attribute:!0,type:String,converter:se,reflect:!1,useDefault:!1,hasChanged:pe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),T.litPropertyMetadata??(T.litPropertyMetadata=new WeakMap);let N=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,s=Ee){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(e,s),!s.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(e,i,s);o!==void 0&&Ke(this.prototype,e,o)}}static getPropertyDescriptor(e,s,i){const{get:o,set:r}=Ye(this.prototype,e)??{get(){return this[s]},set(a){this[s]=a}};return{get:o,set(a){const n=o==null?void 0:o.call(this);r==null||r.call(this,a),this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ee}static _$Ei(){if(this.hasOwnProperty(B("elementProperties")))return;const e=Xe(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(B("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(B("properties"))){const s=this.properties,i=[...We(s),...Ze(s)];for(const o of i)this.createProperty(o,s[o])}const e=this[Symbol.metadata];if(e!==null){const s=litPropertyMetadata.get(e);if(s!==void 0)for(const[i,o]of s)this.elementProperties.set(i,o)}this._$Eh=new Map;for(const[s,i]of this.elementProperties){const o=this._$Eu(s,i);o!==void 0&&this._$Eh.set(o,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const s=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const o of i)s.unshift(Se(o))}else e!==void 0&&s.push(Se(e));return s}static _$Eu(e,s){const i=s.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(s=>s(this))}addController(e){var s;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((s=e.hostConnected)==null||s.call(e))}removeController(e){var s;(s=this._$EO)==null||s.delete(e)}_$E_(){const e=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ve(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostDisconnected)==null?void 0:i.call(s)})}attributeChangedCallback(e,s,i){this._$AK(e,i)}_$ET(e,s){var r;const i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(o!==void 0&&i.reflect===!0){const a=(((r=i.converter)==null?void 0:r.toAttribute)!==void 0?i.converter:se).toAttribute(s,i.type);this._$Em=e,a==null?this.removeAttribute(o):this.setAttribute(o,a),this._$Em=null}}_$AK(e,s){var r,a;const i=this.constructor,o=i._$Eh.get(e);if(o!==void 0&&this._$Em!==o){const n=i.getPropertyOptions(o),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((r=n.converter)==null?void 0:r.fromAttribute)!==void 0?n.converter:se;this._$Em=o;const p=l.fromAttribute(s,n.type);this[o]=p??((a=this._$Ej)==null?void 0:a.get(o))??p,this._$Em=null}}requestUpdate(e,s,i,o=!1,r){var a;if(e!==void 0){const n=this.constructor;if(o===!1&&(r=this[e]),i??(i=n.getPropertyOptions(e)),!((i.hasChanged??pe)(r,s)||i.useDefault&&i.reflect&&r===((a=this._$Ej)==null?void 0:a.get(e))&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,s,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,s,{useDefault:i,reflect:o,wrapped:r},a){i&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,a??s??this[e]),r!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(s=void 0),this._$AL.set(e,s)),o===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,a]of this._$Ep)this[r]=a;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[r,a]of o){const{wrapped:n}=a,l=this[r];n!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,a,l)}}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(i=this._$EO)==null||i.forEach(o=>{var r;return(r=o.hostUpdate)==null?void 0:r.call(o)}),this.update(s)):this._$EM()}catch(o){throw e=!1,this._$EM(),o}e&&this._$AE(s)}willUpdate(e){}_$AE(e){var s;(s=this._$EO)==null||s.forEach(i=>{var o;return(o=i.hostUpdated)==null?void 0:o.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(s=>this._$ET(s,this[s]))),this._$EM()}updated(e){}firstUpdated(e){}};N.elementStyles=[],N.shadowRootOptions={mode:"open"},N[B("elementProperties")]=new Map,N[B("finalized")]=new Map,he==null||he({ReactiveElement:N}),(T.reactiveElementVersions??(T.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const K=globalThis,ke=t=>t,ie=K.trustedTypes,De=ie?ie.createPolicy("lit-html",{createHTML:t=>t}):void 0,Ae="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,Te="?"+M,Je=`<${Te}>`,I=document,Y=()=>I.createComment(""),W=t=>t===null||typeof t!="object"&&typeof t!="function",ue=Array.isArray,Ge=t=>ue(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",fe=`[ 	
\f\r]`,Z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Me=/-->/g,Oe=/>/g,H=RegExp(`>|${fe}(?:([^\\s"'>=/]+)(${fe}*=${fe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ie=/'/g,He=/"/g,ze=/^(?:script|style|textarea|title)$/i,Re=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),c=Re(1),et=Re(2),U=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),je=new WeakMap,z=I.createTreeWalker(I,129);function Ne(t,e){if(!ue(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return De!==void 0?De.createHTML(e):e}const tt=(t,e)=>{const s=t.length-1,i=[];let o,r=e===2?"<svg>":e===3?"<math>":"",a=Z;for(let n=0;n<s;n++){const l=t[n];let p,f,u=-1,g=0;for(;g<l.length&&(a.lastIndex=g,f=a.exec(l),f!==null);)g=a.lastIndex,a===Z?f[1]==="!--"?a=Me:f[1]!==void 0?a=Oe:f[2]!==void 0?(ze.test(f[2])&&(o=RegExp("</"+f[2],"g")),a=H):f[3]!==void 0&&(a=H):a===H?f[0]===">"?(a=o??Z,u=-1):f[1]===void 0?u=-2:(u=a.lastIndex-f[2].length,p=f[1],a=f[3]===void 0?H:f[3]==='"'?He:Ie):a===He||a===Ie?a=H:a===Me||a===Oe?a=Z:(a=H,o=void 0);const C=a===H&&t[n+1].startsWith("/>")?" ":"";r+=a===Z?l+Je:u>=0?(i.push(p),l.slice(0,u)+Ae+l.slice(u)+M+C):l+M+(u===-2?n:C)}return[Ne(t,r+(t[s]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]};class X{constructor({strings:e,_$litType$:s},i){let o;this.parts=[];let r=0,a=0;const n=e.length-1,l=this.parts,[p,f]=tt(e,s);if(this.el=X.createElement(p,i),z.currentNode=this.el.content,s===2||s===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(o=z.nextNode())!==null&&l.length<n;){if(o.nodeType===1){if(o.hasAttributes())for(const u of o.getAttributeNames())if(u.endsWith(Ae)){const g=f[a++],C=o.getAttribute(u).split(M),A=/([.?@])?(.*)/.exec(g);l.push({type:1,index:r,name:A[2],strings:C,ctor:A[1]==="."?it:A[1]==="?"?ot:A[1]==="@"?rt:oe}),o.removeAttribute(u)}else u.startsWith(M)&&(l.push({type:6,index:r}),o.removeAttribute(u));if(ze.test(o.tagName)){const u=o.textContent.split(M),g=u.length-1;if(g>0){o.textContent=ie?ie.emptyScript:"";for(let C=0;C<g;C++)o.append(u[C],Y()),z.nextNode(),l.push({type:2,index:++r});o.append(u[g],Y())}}}else if(o.nodeType===8)if(o.data===Te)l.push({type:2,index:r});else{let u=-1;for(;(u=o.data.indexOf(M,u+1))!==-1;)l.push({type:7,index:r}),u+=M.length-1}r++}}static createElement(e,s){const i=I.createElement("template");return i.innerHTML=e,i}}function L(t,e,s=t,i){var a,n;if(e===U)return e;let o=i!==void 0?(a=s._$Co)==null?void 0:a[i]:s._$Cl;const r=W(e)?void 0:e._$litDirective$;return(o==null?void 0:o.constructor)!==r&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),r===void 0?o=void 0:(o=new r(t),o._$AT(t,s,i)),i!==void 0?(s._$Co??(s._$Co=[]))[i]=o:s._$Cl=o),o!==void 0&&(e=L(t,o._$AS(t,e.values),o,i)),e}class st{constructor(e,s){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:s},parts:i}=this._$AD,o=((e==null?void 0:e.creationScope)??I).importNode(s,!0);z.currentNode=o;let r=z.nextNode(),a=0,n=0,l=i[0];for(;l!==void 0;){if(a===l.index){let p;l.type===2?p=new Q(r,r.nextSibling,this,e):l.type===1?p=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(p=new at(r,this,e)),this._$AV.push(p),l=i[++n]}a!==(l==null?void 0:l.index)&&(r=z.nextNode(),a++)}return z.currentNode=I,o}p(e){let s=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,s),s+=i.strings.length-2):i._$AI(e[s])),s++}}class Q{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,s,i,o){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=s,this._$AM=i,this.options=o,this._$Cv=(o==null?void 0:o.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const s=this._$AM;return s!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=s.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,s=this){e=L(this,e,s),W(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==U&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ge(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&W(this._$AH)?this._$AA.nextSibling.data=e:this.T(I.createTextNode(e)),this._$AH=e}$(e){var r;const{values:s,_$litType$:i}=e,o=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=X.createElement(Ne(i.h,i.h[0]),this.options)),i);if(((r=this._$AH)==null?void 0:r._$AD)===o)this._$AH.p(s);else{const a=new st(o,this),n=a.u(this.options);a.p(s),this.T(n),this._$AH=a}}_$AC(e){let s=je.get(e.strings);return s===void 0&&je.set(e.strings,s=new X(e)),s}k(e){ue(this._$AH)||(this._$AH=[],this._$AR());const s=this._$AH;let i,o=0;for(const r of e)o===s.length?s.push(i=new Q(this.O(Y()),this.O(Y()),this,this.options)):i=s[o],i._$AI(r),o++;o<s.length&&(this._$AR(i&&i._$AB.nextSibling,o),s.length=o)}_$AR(e=this._$AA.nextSibling,s){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,s);e!==this._$AB;){const o=ke(e).nextSibling;ke(e).remove(),e=o}}setConnected(e){var s;this._$AM===void 0&&(this._$Cv=e,(s=this._$AP)==null||s.call(this,e))}}class oe{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,s,i,o,r){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=s,this._$AM=o,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=d}_$AI(e,s=this,i,o){const r=this.strings;let a=!1;if(r===void 0)e=L(this,e,s,0),a=!W(e)||e!==this._$AH&&e!==U,a&&(this._$AH=e);else{const n=e;let l,p;for(e=r[0],l=0;l<r.length-1;l++)p=L(this,n[i+l],s,l),p===U&&(p=this._$AH[l]),a||(a=!W(p)||p!==this._$AH[l]),p===d?e=d:e!==d&&(e+=(p??"")+r[l+1]),this._$AH[l]=p}a&&!o&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class it extends oe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}}class ot extends oe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}}class rt extends oe{constructor(e,s,i,o,r){super(e,s,i,o,r),this.type=5}_$AI(e,s=this){if((e=L(this,e,s,0)??d)===U)return;const i=this._$AH,o=e===d&&i!==d||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==d&&(i===d||o);o&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var s;typeof this._$AH=="function"?this._$AH.call(((s=this.options)==null?void 0:s.host)??this.element,e):this._$AH.handleEvent(e)}}class at{constructor(e,s,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=s,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){L(this,e)}}const _e=K.litHtmlPolyfillSupport;_e==null||_e(X,Q),(K.litHtmlVersions??(K.litHtmlVersions=[])).push("3.3.3");const nt=(t,e,s)=>{const i=(s==null?void 0:s.renderBefore)??e;let o=i._$litPart$;if(o===void 0){const r=(s==null?void 0:s.renderBefore)??null;i._$litPart$=o=new Q(e.insertBefore(Y(),r),r,void 0,s??{})}return o._$AI(t),o};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const R=globalThis;class x extends N{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var s;const e=super.createRenderRoot();return(s=this.renderOptions).renderBefore??(s.renderBefore=e.firstChild),e}update(e){const s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=nt(s,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return U}}x._$litElement$=!0,x.finalized=!0,(Fe=R.litElementHydrateSupport)==null||Fe.call(R,{LitElement:x});const ve=R.litElementPolyfillSupport;ve==null||ve({LitElement:x}),(R.litElementVersions??(R.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const O=t=>(e,s)=>{s!==void 0?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lt={attribute:!0,type:String,converter:se,reflect:!1,hasChanged:pe},ct=(t=lt,e,s)=>{const{kind:i,metadata:o}=s;let r=globalThis.litPropertyMetadata.get(o);if(r===void 0&&globalThis.litPropertyMetadata.set(o,r=new Map),i==="setter"&&((t=Object.create(t)).wrapped=!0),r.set(s.name,t),i==="accessor"){const{name:a}=s;return{set(n){const l=e.get.call(this);e.set.call(this,n),this.requestUpdate(a,l,t,!0,n)},init(n){return n!==void 0&&this.C(a,void 0,t,n),n}}}if(i==="setter"){const{name:a}=s;return function(n){const l=this[a];e.call(this,n),this.requestUpdate(a,l,t,!0,n)}}throw Error("Unsupported decorator location: "+i)};function m(t){return(e,s)=>typeof s=="object"?ct(t,e,s):((i,o,r)=>{const a=o.hasOwnProperty(r);return o.constructor.createProperty(r,i),a?Object.getOwnPropertyDescriptor(o,r):void 0})(t,e,s)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function h(t){return m({...t,state:!0,attribute:!1})}const F=k`
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
`;var dt=Object.defineProperty,ht=Object.getOwnPropertyDescriptor,me=(t,e,s,i)=>{for(var o=i>1?void 0:i?ht(e,s):e,r=t.length-1,a;r>=0;r--)(a=t[r])&&(o=(i?a(e,s,o):a(o))||o);return i&&o&&dt(e,s,o),o};let J=class extends x{constructor(){super(...arguments),this.schedules=[],this.selectedId=null}render(){return c`
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
    `}_onSelect(t){this.dispatchEvent(new CustomEvent("schedule-selected",{detail:{id:t},bubbles:!0,composed:!0}))}_onAdd(){this.dispatchEvent(new CustomEvent("schedule-add",{bubbles:!0,composed:!0}))}_onToggleActive(t,e){this.dispatchEvent(new CustomEvent("schedule-toggle-active",{detail:{id:t,active:e},bubbles:!0,composed:!0}))}};J.styles=[F,k`
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
    `],me([m({type:Array})],J.prototype,"schedules",2),me([m({type:String})],J.prototype,"selectedId",2),J=me([O("schedule-list")],J);function j(t){return typeof t=="string"?{mode:"solid",color:t}:t}const pt=["#1a237e","#4fc3f7","#fff9c4","#ffcc80","#e0e0e0","#81d4fa","#ffab91","#c5e1a5","#b0bec5","#fff176"];function ge(t){switch(t.mode){case"crossfade":return`linear-gradient(90deg, ${t.color}, ${t.color}80)`;case"cycle":{const e=t.colors&&t.colors.length>=2?t.colors:[t.color,"#888"];if(t.transition==="fade")return`linear-gradient(90deg, ${e.join(", ")})`;const s=e.length;return`linear-gradient(90deg, ${e.map((o,r)=>{const a=(r/s*100).toFixed(1),n=((r+1)/s*100).toFixed(1);return`${o} ${a}%, ${o} ${n}%`}).join(", ")})`}case"tv":return`linear-gradient(90deg, ${pt.join(", ")})`;default:return t.color}}var ut=Object.defineProperty,ft=Object.getOwnPropertyDescriptor,be=(t,e,s,i)=>{for(var o=i>1?void 0:i?ft(e,s):e,r=t.length-1,a;r>=0;r--)(a=t[r])&&(o=(i?a(e,s,o):a(o))||o);return i&&o&&ut(e,s,o),o};const ye=new Map,re=new Map;async function _t(t){const e=ye.get(t);if(e!==void 0)return e;const s=re.get(t);if(s)return s;const i=t.replace(/^mdi:/,""),o=fetch(`https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/${i}.svg`).then(r=>r.ok?r.text():"").then(r=>{const a=r.match(/\bd="([^"]+)"/),n=(a==null?void 0:a[1])??"";return ye.set(t,n),re.delete(t),n}).catch(()=>(ye.set(t,""),re.delete(t),""));return re.set(t,o),o}let G=class extends x{constructor(){super(...arguments),this.icon="",this._path="",this._haIconAvailable=customElements.get("ha-icon")!==void 0}willUpdate(t){t.has("icon")&&this.icon&&!this._haIconAvailable&&this._loadPath()}async _loadPath(){this._path="",this.icon&&(this._path=await _t(this.icon))}render(){return this.icon?this._haIconAvailable?c`<ha-icon .icon=${this.icon}></ha-icon>`:this._path?c`
      <svg viewBox="0 0 24 24">
        ${et`<path d=${this._path} />`}
      </svg>
    `:c``:c``}};G.styles=k`
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
  `,be([m({type:String})],G.prototype,"icon",2),be([h()],G.prototype,"_path",2),G=be([O("mdi-icon")],G);var vt=Object.defineProperty,mt=Object.getOwnPropertyDescriptor,y=(t,e,s,i)=>{for(var o=i>1?void 0:i?mt(e,s):e,r=t.length-1,a;r>=0;r--)(a=t[r])&&(o=(i?a(e,s,o):a(o))||o);return i&&o&&vt(e,s,o),o};const w=96,D=16,gt=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],$e=["0","1","2","3","4","5","6"];let b=class extends x{constructor(){super(...arguments),this.cadence="daily",this.slots={},this.customDates=[],this.slotType="on_off",this.palette=[],this.hvacPresets=[],this._dragActive=!1,this._dragValue=0,this._dragStartRow=-1,this._dragStartCol=-1,this._dragEndRow=-1,this._dragEndCol=-1,this._page=0,this._activePaletteIndex=1,this._nowMinutes=b._currentMinutes(),this._timeIndicatorLeft=null,this._mobileTimePos=null,this._isMobile=!1,this._mobileSelectedDayKey="",this._mobilePaintMode=!1,this._daysPerPage=56,this._tapTarget=null,this._tapStartX=0,this._tapStartY=0,this._timerHandle=null,this._mediaQuery=null,this._onMediaChange=t=>{this._isMobile=t.matches}}static _currentMinutes(){const t=new Date;return t.getHours()*60+t.getMinutes()}connectedCallback(){super.connectedCallback(),this._timerHandle=setInterval(()=>{this._nowMinutes=b._currentMinutes()},3e4),this._mediaQuery=window.matchMedia("(max-width: 768px)"),this._isMobile=this._mediaQuery.matches,this._mediaQuery.addEventListener("change",this._onMediaChange)}disconnectedCallback(){var t;super.disconnectedCallback(),this._timerHandle!==null&&(clearInterval(this._timerHandle),this._timerHandle=null),(t=this._mediaQuery)==null||t.removeEventListener("change",this._onMediaChange)}updated(t){super.updated(t),(t.has("_nowMinutes")||t.has("slots")||t.has("cadence")||t.has("_isMobile")||t.has("_mobileSelectedDayKey"))&&requestAnimationFrame(()=>this._updateTimeIndicatorPosition())}_updateTimeIndicatorPosition(){var n,l;if(this._isMobile){this._updateMobileTimeIndicator();return}const t=(n=this.shadowRoot)==null?void 0:n.querySelector(".grid"),e=(l=this.shadowRoot)==null?void 0:l.querySelector(".grid-wrapper");if(!t||!e)return;const s=Math.floor(this._nowMinutes/15),i=this._nowMinutes%15/15,o=t.querySelector(`[data-col="${s}"]`);if(!o)return;const r=e.getBoundingClientRect(),a=o.getBoundingClientRect();this._timeIndicatorLeft=a.left-r.left+a.width*i}_updateMobileTimeIndicator(){var u,g;const t=(u=this.shadowRoot)==null?void 0:u.querySelector(".mobile-grid"),e=(g=this.shadowRoot)==null?void 0:g.querySelector(".grid-wrapper");if(!t||!e){this._mobileTimePos=null;return}const s=this._effectiveMobileDay;if(!(this.cadence==="daily"||this._rowTemporalState(s)==="today")){this._mobileTimePos=null;return}const o=Math.floor(this._nowMinutes/15),r=this._nowMinutes%15/15,a=Math.floor(o/D),n=o%D,l=t.querySelector(`[data-row="${a}"][data-col="${n}"]`);if(!l){this._mobileTimePos=null;return}const p=e.getBoundingClientRect(),f=l.getBoundingClientRect();this._mobileTimePos={left:f.left-p.left+f.width*r,top:f.top-p.top,height:f.height}}get _allDayKeys(){return this.cadence==="daily"?["0"]:this.cadence==="weekly"?$e:this.customDates}get _dayKeys(){if(this.cadence==="daily")return["0"];if(this.cadence==="weekly")return $e;const t=this.customDates;if(t.length<=this._daysPerPage)return t;const e=this._page*this._daysPerPage;return t.slice(e,e+this._daysPerPage)}get _effectiveMobileDay(){const t=this._allDayKeys;return this._mobileSelectedDayKey&&t.includes(this._mobileSelectedDayKey)?this._mobileSelectedDayKey:t[0]||"0"}get _totalPages(){return this.cadence!=="custom"?1:Math.max(1,Math.ceil(this.customDates.length/this._daysPerPage))}_renderLabel(t){if(this.cadence!=="custom")return this._dayLabel(t);const e=new Date(t+"T00:00:00"),s=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][e.getDay()];return c`<span class="day-name">${s}</span><span class="day-date">${t}</span>`}_dayLabel(t){if(this.cadence==="daily")return"Every day";if(this.cadence==="weekly")return gt[parseInt(t)]??t;const e=new Date(t+"T00:00:00");return`${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][e.getDay()]} ${t}`}_mobileDayLabel(t){const e=this._dayLabel(t);return this._rowTemporalState(t)==="today"?`${e} (Today)`:e}render(){return this._isMobile?this._renderMobileLayout():this._renderDesktopLayout()}_renderDesktopLayout(){const t=this._dayKeys,e=Array.from({length:24},(i,o)=>o),s=this.slotType==="color"||this.slotType==="hvac";return c`
      ${s?this._renderPaletteBar():d}
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
            `:d}
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
          `:d}
    `}_renderMobileLayout(){const t=this.slotType==="color"||this.slotType==="hvac",e=this._allDayKeys,s=this._effectiveMobileDay,i=this.slots[s]??new Array(w).fill(0),o=this.cadence!=="daily",r=this.cadence==="daily"||this._rowTemporalState(s)==="today",a=[{label:"00 – 03",startHour:0},{label:"04 – 07",startHour:4},{label:"08 – 11",startHour:8},{label:"12 – 15",startHour:12},{label:"16 – 19",startHour:16},{label:"20 – 23",startHour:20}];return c`
      ${t?this._renderPaletteBar():d}
      <div class="toolbar">
        ${t?c`
              <button class="secondary" @click=${()=>this._bulkSet(this._activePaletteIndex)}>Fill All</button>
              <button class="secondary" @click=${()=>this._bulkSet(0)}>Clear All</button>
            `:c`
              <button class="secondary" @click=${()=>this._bulkSet(1)}>All On</button>
              <button class="secondary" @click=${()=>this._bulkSet(0)}>All Off</button>
            `}
        ${this.cadence==="weekly"?c`<button class="secondary" @click=${this._copyMondayToAll}>Copy Mon → All</button>`:d}
        <button class="secondary paint-toggle ${this._mobilePaintMode?"paint-active":""}"
                @click=${this._togglePaintMode}>
            ${this._mobilePaintMode?"Paint: ON":"Paint: OFF"}
        </button>
        ${o?c`
              <select class="day-select" .value=${s} @change=${this._onMobileDayChange}>
                ${e.map(n=>c`
                  <option value=${n} ?selected=${n===s}>${this._mobileDayLabel(n)}</option>
                `)}
              </select>
            `:d}
      </div>
      <div class="grid-container">
        <div class="grid-wrapper">
          ${this._renderMobileTimeIndicator()}
          <div class="mobile-grid ${this._mobilePaintMode?"paint-active":""}" @mouseup=${this._onMouseUp} @mouseleave=${this._onMouseUp}>
            ${a.map((n,l)=>{const p=l*D,f=Array.from({length:4},(u,g)=>n.startHour+g);return c`
                <div class="header-spacer"></div>
                ${f.map(u=>c`
                  <div class="header-cell" style="grid-column: span 4">${String(u).padStart(2,"0")}</div>
                `)}
                <div class="row-label ${r?"today-row":""}">${n.label}</div>
                ${Array.from({length:D},(u,g)=>{const C=p+g,A=i[C],It=this._isInDragRegion(l,g),Ht=t?this._paletteCellStyle(A):"";return c`
                    <div
                      class="cell ${t?A?"color-set":"off":A?"on":"off"} ${r?"today-row":""} ${It?"drag-preview":""} ${g%4===0?"hour-start":""}"
                      style=${Ht}
                      data-row=${l}
                      data-col=${g}
                      data-day=${s}
                      title="${this._cellTooltip(C,A)}"
                      @mousedown=${ee=>this._onMouseDown(ee,l,g,s)}
                      @mouseenter=${ee=>this._onMouseEnter(ee,l,g)}
                      @touchstart=${ee=>this._onTouchStart(ee,l,g,s)}
                      @touchmove=${this._onTouchMove}
                      @touchend=${this._onTouchEnd}
                    ></div>
                  `})}
              `})}
          </div>
        </div>
      </div>
    `}_onMobileDayChange(t){this._mobileSelectedDayKey=t.target.value}_togglePaintMode(){this._mobilePaintMode=!this._mobilePaintMode}_toggleSingleCell(t,e,s){const i=t*D+e;if(i>=w)return;const o=[...this.slots[s]??new Array(w).fill(0)];this.slotType==="color"||this.slotType==="hvac"?o[i]=o[i]===this._activePaletteIndex?0:this._activePaletteIndex:o[i]=o[i]?0:1;const r={...this.slots,[s]:o};this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:r},bubbles:!0,composed:!0}))}_weekIndex(t){if(this.cadence!=="custom")return 0;const e=new Date(t+"T00:00:00"),s=this.customDates;if(s.length===0)return 0;const i=new Date(s[0]+"T00:00:00"),o=new Date(i);o.setDate(i.getDate()-i.getDay());const r=Math.floor((e.getTime()-o.getTime())/864e5);return Math.floor(r/7)}_rowTemporalState(t){const e=new Date;if(this.cadence==="weekly"){const s=String((e.getDay()+6)%7);return t===s?"today":"other"}if(this.cadence==="custom"){const s=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`;return t===s?"today":t<s?"past":"other"}return"other"}_renderRow(t,e){const s=this.slots[t]??new Array(w).fill(0),i=this.slotType==="color"||this.slotType==="hvac",o=this.cadence==="custom"&&this._weekIndex(t)%2===1,r=this._rowTemporalState(t),a=r==="today",n=r==="past";return c`
      <div class="row-label ${o?"week-even":""} ${a?"today-row":""} ${n?"past-row":""}">${this._renderLabel(t)}</div>
      ${s.map((l,p)=>{const f=this._isInDragRegion(e,p),u=i?this._paletteCellStyle(l):"";return c`
          <div
            class="cell ${i?l?"color-set":"off":l?"on":"off"} ${o&&!l?"week-even":""} ${a?"today-row":""} ${n?"past-row":""} ${f?"drag-preview":""} ${p%4===0?"hour-start":""}"
            style=${u}
            data-row=${e}
            data-col=${p}
            data-day=${t}
            title="${this._cellTooltip(p,l)}"
            @mousedown=${g=>this._onMouseDown(g,e,p,t)}
            @mouseenter=${g=>this._onMouseEnter(g,e,p)}
            @touchstart=${g=>this._onTouchStart(g,e,p,t)}
            @touchmove=${this._onTouchMove}
            @touchend=${this._onTouchEnd}
          ></div>
        `})}
    `}_cellTooltip(t,e=0){const s=Math.floor(t*15/60),i=t*15%60,o=Math.floor((t+1)*15/60),r=(t+1)*15%60,a=`${String(s).padStart(2,"0")}:${String(i).padStart(2,"0")} – ${String(o).padStart(2,"0")}:${String(r).padStart(2,"0")}`;if(this.slotType==="hvac"&&e>0&&this.hvacPresets&&e<=this.hvacPresets.length){const n=this.hvacPresets[e-1],l=[a];return n.alias&&l.push(n.alias),n.temperature!==null&&l.push(`Temp: ${n.temperature}°C`),n.hvac_mode&&l.push(`Mode: ${n.hvac_mode}`),n.fan_mode&&l.push(`Fan: ${n.fan_mode}`),l.join(`
`)}if(this.slotType==="color"&&e>0&&this.palette&&e<=this.palette.length){const n=j(this.palette[e-1]);if(n.mode==="cycle"&&n.alias)return`${a}
${n.alias}`}return a}_paletteCellStyle(t){if(t===0)return"";if(this.slotType==="hvac")return!this.hvacPresets||t>this.hvacPresets.length?"":`background: ${this.hvacPresets[t-1].color}`;if(!this.palette||t>this.palette.length)return"";const e=j(this.palette[t-1]);return`background: ${ge(e)}`}_renderPaletteBar(){const e=this.slotType==="hvac"?this.hvacPresets.map((s,i)=>({color:s.color,label:s.alias||this._hvacShortLabel(s),tooltip:this._hvacSwatchTooltip(s),icon:s.icon,index:i+1})):this.palette.map((s,i)=>{const o=j(s),r=o.mode==="crossfade"?"⇢":o.mode==="cycle"?"⟳":o.mode==="tv"?"📺":"",a=o.mode==="cycle"&&o.alias?o.alias:`${o.color} (${o.mode})`;return{color:ge(o),label:a,tooltip:o.alias?`${o.alias}
${o.color} – ${o.mode}`:`${o.color} – ${o.mode}`,icon:r||void 0,index:i+1}});return c`
      <div class="palette-bar">
        <span>Paint:</span>
        <div
          class="palette-swatch eraser ${this._activePaletteIndex===0?"active":""}"
          title="Eraser"
          @click=${()=>{this._activePaletteIndex=0}}
        >✕</div>
        ${e.map(s=>c`
          <div
            class="palette-swatch ${this._activePaletteIndex===s.index?"active":""}"
            style="background: ${s.color}"
            title="${s.tooltip}"
            @click=${()=>{this._activePaletteIndex=s.index}}
          >${s.icon?c`<mdi-icon .icon=${s.icon} style="--mdi-icon-size:16px"></mdi-icon>`:""}</div>
        `)}
      </div>
    `}_hvacShortLabel(t){const e=[];return t.temperature!==null&&e.push(`${t.temperature}°`),t.hvac_mode&&e.push(t.hvac_mode),t.fan_mode&&e.push(t.fan_mode),e.join(" | ")||"Preset"}_hvacSwatchTooltip(t){const e=[];return t.alias&&e.push(t.alias),t.temperature!==null&&e.push(`Temp: ${t.temperature}°C`),t.hvac_mode&&e.push(`Mode: ${t.hvac_mode}`),t.fan_mode&&e.push(`Fan: ${t.fan_mode}`),e.join(`
`)}_renderTimeIndicator(){if(this._timeIndicatorLeft===null)return d;const t=Math.floor(this._nowMinutes/60),e=this._nowMinutes%60,s=`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`,i=`${this._timeIndicatorLeft}px`;return c`
      <span class="time-label top" style="left: ${i}">${s}</span>
      <div class="time-indicator" style="left: ${i}"></div>
      <span class="time-label bottom" style="left: ${i}">${s}</span>
    `}_renderMobileTimeIndicator(){if(!this._mobileTimePos)return d;const t=Math.floor(this._nowMinutes/60),e=this._nowMinutes%60,s=`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`,{left:i,top:o,height:r}=this._mobileTimePos;return c`
      <span class="time-label" style="left: ${i}px; top: ${o}px; transform: translate(-50%, -100%)">${s}</span>
      <div class="time-indicator" style="left: ${i}px; top: ${o}px; height: ${r}px; bottom: auto"></div>
    `}_isInDragRegion(t,e){if(!this._dragActive)return!1;const s=Math.min(this._dragStartRow,this._dragEndRow),i=Math.max(this._dragStartRow,this._dragEndRow),o=Math.min(this._dragStartCol,this._dragEndCol),r=Math.max(this._dragStartCol,this._dragEndCol);return t>=s&&t<=i&&e>=o&&e<=r}_onMouseDown(t,e,s,i){t.preventDefault();const o=this.slots[i]??new Array(w).fill(0),r=this._isMobile?e*D+s:s;this.slotType==="color"||this.slotType==="hvac"?this._dragValue=o[r]===this._activePaletteIndex?0:this._activePaletteIndex:this._dragValue=o[r]?0:1,this._dragStartRow=e,this._dragStartCol=s,this._dragEndRow=e,this._dragEndCol=s,this._dragActive=!0}_onMouseEnter(t,e,s){this._dragActive&&(this._dragEndRow=e,this._dragEndCol=s)}_onMouseUp(){this._dragActive&&(this._applyDrag(),this._dragActive=!1)}_onTouchStart(t,e,s,i){if(this._isMobile&&!this._mobilePaintMode){const a=t.touches[0];this._tapTarget={row:e,col:s,dayKey:i},this._tapStartX=a.clientX,this._tapStartY=a.clientY;return}t.preventDefault();const o=this.slots[i]??new Array(w).fill(0),r=this._isMobile?e*D+s:s;this.slotType==="color"||this.slotType==="hvac"?this._dragValue=o[r]===this._activePaletteIndex?0:this._activePaletteIndex:this._dragValue=o[r]?0:1,this._dragStartRow=e,this._dragStartCol=s,this._dragEndRow=e,this._dragEndCol=s,this._dragActive=!0}_onTouchMove(t){var i;if(this._isMobile&&!this._mobilePaintMode){if(this._tapTarget){const o=t.touches[0],r=Math.abs(o.clientX-this._tapStartX),a=Math.abs(o.clientY-this._tapStartY);(r>10||a>10)&&(this._tapTarget=null)}return}if(!this._dragActive)return;const e=t.touches[0],s=(i=this.shadowRoot)==null?void 0:i.elementFromPoint(e.clientX,e.clientY);(s==null?void 0:s.dataset.row)!==void 0&&(s==null?void 0:s.dataset.col)!==void 0&&(this._dragEndRow=parseInt(s.dataset.row),this._dragEndCol=parseInt(s.dataset.col))}_onTouchEnd(){if(this._isMobile&&!this._mobilePaintMode){this._tapTarget&&(this._toggleSingleCell(this._tapTarget.row,this._tapTarget.col,this._tapTarget.dayKey),this._tapTarget=null);return}this._dragActive&&(this._applyDrag(),this._dragActive=!1)}_applyDrag(){const t=Math.min(this._dragStartRow,this._dragEndRow),e=Math.max(this._dragStartRow,this._dragEndRow),s=Math.min(this._dragStartCol,this._dragEndCol),i=Math.max(this._dragStartCol,this._dragEndCol),o={...this.slots};if(this._isMobile){const r=this._effectiveMobileDay,a=[...o[r]??new Array(w).fill(0)];for(let n=t;n<=e;n++)for(let l=s;l<=i;l++){const p=n*D+l;p<w&&(a[p]=this._dragValue)}o[r]=a}else{const r=this._dayKeys;for(let a=t;a<=e;a++){const n=r[a];if(!n)continue;const l=[...o[n]??new Array(w).fill(0)];for(let p=s;p<=i;p++)l[p]=this._dragValue;o[n]=l}}this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:o},bubbles:!0,composed:!0}))}_bulkSet(t){const e=this.cadence==="custom"?this.customDates:this._dayKeys,s={};for(const i of e)s[i]=new Array(w).fill(t);this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:s},bubbles:!0,composed:!0}))}_copyMondayToAll(){const t=this.slots[0]??new Array(w).fill(0),e={};for(const s of $e)e[s]=[...t];this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:e},bubbles:!0,composed:!0}))}_prevPage(){this._page=Math.max(0,this._page-1)}_nextPage(){this._page=Math.min(this._totalPages-1,this._page+1)}};b.styles=[F,k`
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
        grid-template-columns: 130px repeat(${w}, minmax(var(--ss-cell-size), 1fr));
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
      /* ── Mobile layout ── */
      .day-select {
        flex: 1;
        min-width: 120px;
      }
      .mobile-grid {
        display: grid;
        grid-template-columns: 64px repeat(${D}, 1fr);
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
    `],y([m({type:String})],b.prototype,"cadence",2),y([m({type:Object})],b.prototype,"slots",2),y([m({type:Array})],b.prototype,"customDates",2),y([m({type:String})],b.prototype,"slotType",2),y([m({type:Array})],b.prototype,"palette",2),y([m({type:Array})],b.prototype,"hvacPresets",2),y([h()],b.prototype,"_dragActive",2),y([h()],b.prototype,"_dragValue",2),y([h()],b.prototype,"_dragStartRow",2),y([h()],b.prototype,"_dragStartCol",2),y([h()],b.prototype,"_dragEndRow",2),y([h()],b.prototype,"_dragEndCol",2),y([h()],b.prototype,"_page",2),y([h()],b.prototype,"_activePaletteIndex",2),y([h()],b.prototype,"_nowMinutes",2),y([h()],b.prototype,"_timeIndicatorLeft",2),y([h()],b.prototype,"_mobileTimePos",2),y([h()],b.prototype,"_isMobile",2),y([h()],b.prototype,"_mobileSelectedDayKey",2),y([h()],b.prototype,"_mobilePaintMode",2),b=y([O("schedule-grid")],b);var bt=Object.defineProperty,yt=Object.getOwnPropertyDescriptor,E=(t,e,s,i)=>{for(var o=i>1?void 0:i?yt(e,s):e,r=t.length-1,a;r>=0;r--)(a=t[r])&&(o=(i?a(e,s,o):a(o))||o);return i&&o&&bt(e,s,o),o};const $t=["switch","light","fan","input_boolean","climate"],xt=["rgb","rgbw","rgbww","hs","xy"],wt={switch:{on:"M17 7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h10a5 5 0 0 0 5-5 5 5 0 0 0-5-5m0 8a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3Z",off:"M17 7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h10a5 5 0 0 0 5-5 5 5 0 0 0-5-5M7 15a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3Z"},light:{on:"M12 6a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 0 1 6-6m2 15v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1h4m-3-5h2l.5-4h-3l.5 4Z",off:"M12 6a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 0 1 6-6m2 15v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1h4M12 8a4 4 0 0 0-4 4c0 1.54.83 2.87 2.07 3.6l.43.25V18h3v-2.15l.43-.25A4.02 4.02 0 0 0 16 12a4 4 0 0 0-4-4Z"},fan:{on:"M12 11a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1m4.22-.99c-.67.49-1.47.86-2.23 1.12.03.31-.02.63-.14.93 1.59 1.08 2.75 2.59 2.75 3.2 0 .43-.55.86-1.5 1.18-.96.32-2.2.5-3.5.56-.45-.6-1.07-1.08-1.74-1.42.03-.77.13-1.51.31-2.2-.52-.36-.9-.87-1.1-1.45A9.82 9.82 0 0 1 5 12.83c0-.72.53-1.35 1.42-1.82.89-.47 2.05-.77 3.34-.89.4.55.94.97 1.56 1.2.44-.66.97-1.26 1.59-1.77-.29-.47-.42-1.01-.39-1.55A9.73 9.73 0 0 1 12 4.29c.72 0 1.35.53 1.82 1.42.47.89.77 2.05.89 3.34a3.43 3.43 0 0 0-1.2 1.56c.65.43 1.24.96 1.75 1.58.48-.29 1.02-.43 1.56-.4.84.19 1.64.46 2.36.83.72.37 1.19.93 1.19 1.55 0 .72-.53 1.35-1.42 1.82-.89.47-2.05.77-3.34.89a3.43 3.43 0 0 0-1.2-1.56Z",off:"M12 11a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1m4.22-.99c-.67.49-1.47.86-2.23 1.12.03.31-.02.63-.14.93 1.59 1.08 2.75 2.59 2.75 3.2 0 .43-.55.86-1.5 1.18-.96.32-2.2.5-3.5.56-.45-.6-1.07-1.08-1.74-1.42.03-.77.13-1.51.31-2.2-.52-.36-.9-.87-1.1-1.45A9.82 9.82 0 0 1 5 12.83c0-.72.53-1.35 1.42-1.82.89-.47 2.05-.77 3.34-.89.4.55.94.97 1.56 1.2.44-.66.97-1.26 1.59-1.77-.29-.47-.42-1.01-.39-1.55A9.73 9.73 0 0 1 12 4.29c.72 0 1.35.53 1.82 1.42.47.89.77 2.05.89 3.34a3.43 3.43 0 0 0-1.2 1.56c.65.43 1.24.96 1.75 1.58.48-.29 1.02-.43 1.56-.4.84.19 1.64.46 2.36.83.72.37 1.19.93 1.19 1.55 0 .72-.53 1.35-1.42 1.82-.89.47-2.05.77-3.34.89a3.43 3.43 0 0 0-1.2-1.56Z"},cover:{on:"M3 4h18v2H3V4m0 14h18v2H3v-2m0-7h18v2H3v-2m0 3.5h18v1H3v-1m0-7h18v1H3v-1Z",off:"M3 4h18v2H3V4m0 14h18v2H3v-2Z"},climate:{on:"M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-8a1 1 0 0 1 1 1v3h-2V6a1 1 0 0 1 1-1Z",off:"M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-8a1 1 0 0 1 1 1v3h-2V6a1 1 0 0 1 1-1Z"},input_boolean:{on:"M17 7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h10a5 5 0 0 0 5-5 5 5 0 0 0-5-5m0 8a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3Z",off:"M17 7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h10a5 5 0 0 0 5-5 5 5 0 0 0-5-5M7 15a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3Z"}},Pt="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4c-1.1 0-2 .9-2 2v3.8h1.5c1.4 0 2.5 1.1 2.5 2.5S4.9 15.8 3.5 15.8H2V19c0 1.1.9 2 2 2h3.8v-1.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5V21H17c1.1 0 2-.9 2-2v-4h1.5a2.5 2.5 0 0 0 0-5Z";let P=class extends x{constructor(){super(...arguments),this.slotType="on_off",this.selectedIds=[],this.overrides={},this.scheduledStates={},this.unavailableEntities=[],this.showOverrides=!1,this._query="",this._open=!1}_isEntityCompatible(t){var s,i,o,r;const e=t.split(".")[0];if(this.slotType==="color"){if(e!=="light")return!1;const a=(r=(o=(i=(s=this.hass)==null?void 0:s.states)==null?void 0:i[t])==null?void 0:o.attributes)==null?void 0:r.supported_color_modes;return Array.isArray(a)&&a.some(n=>xt.includes(n))}return this.slotType==="hvac"?e==="climate":$t.includes(e)}_incompatibleReason(t){const e=t.split(".")[0],s=e.replace("_"," ");return this.slotType==="color"?e!=="light"?`${s} does not support colour`:"light does not support colour modes":this.slotType==="hvac"?`${s} does not support HVAC states`:"incompatible"}get _availableEntities(){var e;if(!((e=this.hass)!=null&&e.states))return[];const t=new Set(this.selectedIds);return Object.keys(this.hass.states).filter(s=>t.has(s)?!1:this._isEntityCompatible(s)).map(s=>{var i,o;return{id:s,name:((o=(i=this.hass.states[s])==null?void 0:i.attributes)==null?void 0:o.friendly_name)??s}}).sort((s,i)=>s.id.localeCompare(i.id))}get _filtered(){const t=this._query.toLowerCase();return t?this._availableEntities.filter(e=>e.id.toLowerCase().includes(t)||e.name.toLowerCase().includes(t)):this._availableEntities}render(){return c`
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
        ${this._open?this._renderDropdown():d}
      </div>
    `}_renderEntityRow(t){var p,f,u;const e=this.overrides[t],s=this.scheduledStates[t],i=((u=(f=(p=this.hass)==null?void 0:p.states)==null?void 0:f[t])==null?void 0:u.state)==="on"?"on":"off",o=this.unavailableEntities.includes(t),r=!o&&!this._isEntityCompatible(t);let a="";o?a="unavailable":r?a="incompatible":this.showOverrides&&e&&(a=e===s?"override-match":"override-conflict");const n=e==="on"?"active-on":!e&&this.showOverrides&&i==="on"?"current-state":"",l=e==="off"?"active-off":!e&&this.showOverrides&&i==="off"?"current-state":"";return c`
      <div class="entity-row ${a}">
        <span class="entity-name">
          ${this._renderEntityIcon(t)}
          ${this._friendlyName(t)}
          <span class="entity-id">${t}</span>
        </span>
        ${o?c`<span class="unavailable-badge">unavailable</span>`:d}
        ${r?c`<span class="incompatible-badge" title=${this._incompatibleReason(t)}>${this._incompatibleReason(t)}</span>`:d}
        ${this.showOverrides&&this.slotType!=="color"?c`
          <span class="override-controls">
            <button
              class="override-btn ${n}"
              title="Override On"
              @click=${()=>this._onOverride(t,"on")}
            >On</button>
            <button
              class="override-btn ${l}"
              title="Override Off"
              @click=${()=>this._onOverride(t,"off")}
            >Off</button>
          </span>
        `:d}
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
    `}_friendlyName(t){var e,s,i,o;return((o=(i=(s=(e=this.hass)==null?void 0:e.states)==null?void 0:s[t])==null?void 0:i.attributes)==null?void 0:o.friendly_name)??t}_entityIcon(t){var a,n,l;const e=t.split(".")[0],s=(n=(a=this.hass)==null?void 0:a.states)==null?void 0:n[t],i=(l=s==null?void 0:s.attributes)==null?void 0:l.icon;if(i)return i;const o=(s==null?void 0:s.state)==="on",r=wt[e];return r?o?r.on:r.off:Pt}_renderEntityIcon(t){var a,n,l;const e=(n=(a=this.hass)==null?void 0:a.states)==null?void 0:n[t],s=(l=e==null?void 0:e.attributes)==null?void 0:l.icon;if(s)return c`<mdi-icon class="entity-icon" .icon=${s} style="--mdi-icon-size: 18px"></mdi-icon>`;const i=e==null?void 0:e.state,o=i==="unavailable"||i==="unknown"?"state-unavailable":i==="on"?"state-on":"state-off",r=this._entityIcon(t);return c`<svg class="entity-icon ${o}" viewBox="0 0 24 24"><path d=${r}/></svg>`}_onInput(t){this._query=t.target.value,this._open=!0}_onBlur(){setTimeout(()=>{this._open=!1},150)}_select(t){const e=[...this.selectedIds,t];this._query="",this._fireChanged(e)}_remove(t){const e=this.selectedIds.filter(s=>s!==t);this._fireChanged(e)}_onOverride(t,e){this.overrides[t]===e?this.dispatchEvent(new CustomEvent("override-clear",{detail:{entityId:t},bubbles:!0,composed:!0})):this.dispatchEvent(new CustomEvent("override-set",{detail:{entityId:t,state:e},bubbles:!0,composed:!0}))}_fireChanged(t){this.dispatchEvent(new CustomEvent("entities-changed",{detail:{entityIds:t},bubbles:!0,composed:!0}))}};P.styles=[F,k`
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
    `],E([m({attribute:!1})],P.prototype,"hass",2),E([m({type:String})],P.prototype,"slotType",2),E([m({type:Array})],P.prototype,"selectedIds",2),E([m({type:Object})],P.prototype,"overrides",2),E([m({type:Object})],P.prototype,"scheduledStates",2),E([m({type:Array})],P.prototype,"unavailableEntities",2),E([m({type:Boolean})],P.prototype,"showOverrides",2),E([h()],P.prototype,"_query",2),E([h()],P.prototype,"_open",2),P=E([O("entity-picker")],P);var St=Object.defineProperty,Ct=Object.getOwnPropertyDescriptor,ae=(t,e,s,i)=>{for(var o=i>1?void 0:i?Ct(e,s):e,r=t.length-1,a;r>=0;r--)(a=t[r])&&(o=(i?a(e,s,o):a(o))||o);return i&&o&&St(e,s,o),o};const Ue=["mdi:thermometer","mdi:thermometer-high","mdi:thermometer-low","mdi:thermometer-lines","mdi:thermometer-chevron-up","mdi:thermometer-chevron-down","mdi:snowflake","mdi:snowflake-alert","mdi:snowflake-variant","mdi:fire","mdi:fire-alert","mdi:fan","mdi:fan-off","mdi:fan-speed-1","mdi:fan-speed-2","mdi:fan-speed-3","mdi:air-conditioner","mdi:air-filter","mdi:heat-wave","mdi:heat-pump","mdi:heat-pump-outline","mdi:coolant-temperature","mdi:hvac","mdi:weather-sunny","mdi:weather-night","mdi:weather-partly-cloudy","mdi:sun-thermometer","mdi:sun-thermometer-outline","mdi:home-thermometer","mdi:home-thermometer-outline","mdi:water-percent","mdi:water","mdi:water-off","mdi:waves","mdi:weather-windy","mdi:sun-snowflake-variant","mdi:power","mdi:power-off","mdi:power-plug","mdi:power-plug-off","mdi:flash","mdi:flash-off","mdi:lightning-bolt","mdi:battery","mdi:battery-charging","mdi:solar-power","mdi:solar-panel","mdi:clock","mdi:clock-outline","mdi:timer","mdi:timer-outline","mdi:calendar","mdi:calendar-clock","mdi:weather-sunset-up","mdi:weather-sunset-down","mdi:moon-waning-crescent","mdi:moon-full","mdi:home","mdi:home-outline","mdi:bed","mdi:bed-outline","mdi:sofa","mdi:desk","mdi:door","mdi:door-open","mdi:window-open","mdi:window-closed","mdi:garage","mdi:office-building","mdi:lightbulb","mdi:lightbulb-outline","mdi:lightbulb-off","mdi:lamp","mdi:ceiling-light","mdi:floor-lamp","mdi:led-strip","mdi:led-strip-variant","mdi:check","mdi:close","mdi:alert","mdi:information","mdi:cog","mdi:tune","mdi:wrench","mdi:leaf","mdi:tree","mdi:flower","mdi:account","mdi:account-group","mdi:star","mdi:heart","mdi:bell","mdi:eye","mdi:eye-off","mdi:lock","mdi:lock-open","mdi:shield","mdi:shield-check","mdi:volume-high","mdi:volume-off","mdi:wifi","mdi:bluetooth","mdi:car","mdi:walk","mdi:bike"];let q=class extends x{constructor(){super(...arguments),this.value="",this._query="",this._open=!1,this._onDocClick=t=>{this._open&&!this.renderRoot.contains(t.target)&&!this.contains(t.target)&&(this._open=!1)}}get _filtered(){const t=this._query.toLowerCase().replace(/^mdi:/,"");return t?Ue.filter(e=>e.toLowerCase().includes(t)):Ue}render(){return c`
      <div class="picker-input">
        ${this.value?c`<div class="current-icon"><mdi-icon .icon=${this.value}></mdi-icon></div>`:d}
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
        `:d}
      </div>
      ${this._open?this._renderDropdown():d}
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
    `}_onFocus(){this._query=this.value||"",this._open=!0}_onInput(t){this._query=t.target.value,this._open||(this._open=!0)}_onKeydown(t){if(t.key==="Escape")this._open=!1,t.target.blur();else if(t.key==="Enter"){t.preventDefault();const e=this._filtered;if(e.length===1)this._select(e[0]);else if(this._query){const s=this._query.startsWith("mdi:")?this._query:`mdi:${this._query}`;this._select(s)}}}_select(t){this._open=!1,this._query="",this._fireChange(t)}_clear(){this._open=!1,this._query="",this._fireChange("")}_fireChange(t){this.dispatchEvent(new CustomEvent("icon-changed",{detail:{icon:t},bubbles:!0,composed:!0}))}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this._onDocClick)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._onDocClick)}};q.styles=[F,k`
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
    `],ae([m({type:String})],q.prototype,"value",2),ae([h()],q.prototype,"_query",2),ae([h()],q.prototype,"_open",2),q=ae([O("icon-picker")],q);var Et=Object.defineProperty,kt=Object.getOwnPropertyDescriptor,ne=(t,e,s,i)=>{for(var o=i>1?void 0:i?kt(e,s):e,r=t.length-1,a;r>=0;r--)(a=t[r])&&(o=(i?a(e,s,o):a(o))||o);return i&&o&&Et(e,s,o),o};let V=class extends x{constructor(){super(...arguments),this.message="",this.type="info",this.visible=!1,this._timer=null}render(){return c`
      <div class="toast ${this.type}" @click=${this.dismiss}>
        ${this.message}
      </div>
    `}show(t,e="info"){this._timer&&clearTimeout(this._timer),this.message=t,this.type=e,this.visible=!0,this._timer=setTimeout(()=>this.dismiss(),5e3)}dismiss(){this.visible=!1,this._timer&&(clearTimeout(this._timer),this._timer=null)}};V.styles=k`
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
  `,ne([m({type:String})],V.prototype,"message",2),ne([m({type:String})],V.prototype,"type",2),ne([m({type:Boolean,reflect:!0})],V.prototype,"visible",2),V=ne([O("toast-notification")],V);var Dt=Object.defineProperty,At=Object.getOwnPropertyDescriptor,v=(t,e,s,i)=>{for(var o=i>1?void 0:i?At(e,s):e,r=t.length-1,a;r>=0;r--)(a=t[r])&&(o=(i?a(e,s,o):a(o))||o);return i&&o&&Dt(e,s,o),o};const xe=96,Tt=["0","1","2","3","4","5","6"];function le(t){if(t==="daily")return{0:new Array(xe).fill(0)};if(t==="weekly"){const e={};for(const s of Tt)e[s]=new Array(xe).fill(0);return e}return{}}function Le(t,e){const s=[],i=new Date(t),o=new Date(e);for(;i<=o;)s.push(i.toISOString().slice(0,10)),i.setDate(i.getDate()+1);return s}let _=class extends x{constructor(){super(...arguments),this.schedule=null,this.isNew=!1,this.globalHvacPresets=[],this.globalColorPresets=[],this._name="",this._entityIds=[],this._cadence="daily",this._repeat=!0,this._startDate="",this._endDate="",this._slots={},this._conflicts=[],this._saving=!1,this._deleting=!1,this._dirty=!1,this._confirmDelete=!1,this._confirmDiscard=!1,this._active=!0,this._overrides={},this._scheduledStates={},this._unavailableEntities=[],this._revertDelay=180,this._slotType="on_off",this._palette=["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ff8800","#ffffff"],this._hvacPresets=[],this._hvacEditIndex=null,this._confirmDeletePresetIndex=null,this._confirmDeletePresetUsage=[],this._paletteEditIndex=null,this._confirmDeletePaletteIndex=null,this._confirmDeletePaletteUsage=[],this._pendingSlotType=null,this._unsubOverrides=null}connectedCallback(){super.connectedCallback(),this._subscribeOverrideEvents()}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._unsubOverrides)==null||t.call(this),this._unsubOverrides=null}async _subscribeOverrideEvents(){try{this._unsubOverrides=await this.hass.connection.subscribeEvents(t=>{var s,i;const e=(s=t.data)==null?void 0:s.schedule_id;e&&((i=this.schedule)==null?void 0:i.id)===e&&this._loadOverrides()},"oncue_scheduler_overrides_changed")}catch{}}willUpdate(t){t.has("schedule")?(this._loadFromSchedule(),this._confirmDelete=!1,this._confirmDiscard=!1,this._loadOverrides()):t.has("globalHvacPresets")&&!this._dirty&&(this._hvacPresets=this.globalHvacPresets.map(e=>({...e})))}get _toast(){return this.renderRoot.querySelector("toast-notification")}_showToast(t,e="info"){var s;(s=this._toast)==null||s.show(t,e)}_loadFromSchedule(){this.schedule?(this._name=this.schedule.name,this._entityIds=[...this.schedule.entity_ids],this._cadence=this.schedule.cadence,this._repeat=this.schedule.repeat,this._startDate=this.schedule.start_date??"",this._endDate=this.schedule.end_date??"",this._slots=JSON.parse(JSON.stringify(this.schedule.slots)),this._active=this.schedule.active,this._revertDelay="revert_delay"in this.schedule?this.schedule.revert_delay:180,this._slotType=this.schedule.slot_type??"on_off",this._palette=this.globalColorPresets.length>0?[...this.globalColorPresets]:["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ff8800","#ffffff"],this._hvacPresets=this.globalHvacPresets.map(t=>({...t})),this._hvacEditIndex=null):(this._name="",this._entityIds=[],this._cadence="daily",this._repeat=!0,this._startDate="",this._endDate="",this._slots=le("daily"),this._active=!0,this._revertDelay=180,this._slotType="on_off",this._palette=this.globalColorPresets.length>0?[...this.globalColorPresets]:["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ff8800","#ffffff"],this._hvacPresets=this.globalHvacPresets.map(t=>({...t})),this._hvacEditIndex=null),this._dirty=!1,this._conflicts=[]}render(){if(!this.schedule&&!this.isNew)return c`<div class="empty-msg">Select a schedule or create a new one.</div>`;const t=this._cadence==="custom"&&this._startDate&&this._endDate?Le(this._startDate,this._endDate):[],e=this._saving||this._deleting;return c`
      <toast-notification></toast-notification>
      <div class="editor-wrapper">
      ${e?c`<div class="loading-overlay"><div class="spinner"></div></div>`:d}
      <div class="editor-header">
        <h2>${this.isNew?"New Schedule":"Edit Schedule"}
          ${this.isNew?d:c`
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
          ${this.isNew?d:this._confirmDelete?c`
                <div class="inline-confirm">
                  <span>Delete?</span>
                  <button class="danger" @click=${this._doDelete}>Yes</button>
                  <button class="secondary" @click=${()=>{this._confirmDelete=!1}}>No</button>
                </div>
              `:c`<button class="danger" @click=${this._onDelete}>Delete</button>`}
          <button class="primary" ?disabled=${e} @click=${this._onSave}>
            ${this._saving?"Saving...":"Save"}
          </button>
        </div>
      </div>

      ${this._conflicts.length>0?c`
            <div class="warning-banner">
              ⚠ Conflicts detected with:
              ${this._conflicts.map(s=>s.schedule_name).join(", ")}
            </div>
          `:d}

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

        <div class="form-group">
          <label for="cadence">Cadence</label>
          <div class="cadence-row">
            <select
              id="cadence"
              .value=${this._cadence}
              @change=${s=>{const i=s.target.value;this._cadence=i,this._slots=le(i),this._dirty=!0}}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
            <label class="repeat-check">
              <input
                type="checkbox"
                .checked=${this._repeat}
                @change=${s=>{this._repeat=s.target.checked,this._dirty=!0}}
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
              @input=${s=>{const i=parseInt(s.target.value)||0,o=(this._revertDelay??0)%60;this._revertDelay=i*60+o,this._dirty=!0}}
            />
            <span>min</span>
            <input
              type="number"
              min="0"
              max="59"
              style="width: 60px"
              .value=${this._revertDelay!==null?String(this._revertDelay%60):"0"}
              ?disabled=${this._revertDelay===null}
              @input=${s=>{const i=parseInt(s.target.value)||0,o=Math.floor((this._revertDelay??0)/60);this._revertDelay=o*60+i,this._dirty=!0}}
            />
            <span>sec</span>
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
            `:d}

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

        <div class="form-group">
          <label for="slot-type">Slot Type</label>
          <select
            id="slot-type"
            .value=${this._slotType}
            @change=${s=>{const i=s.target.value;if(i!==this._slotType){if(Object.values(this._slots).some(r=>r.some(a=>a!==0))){this._pendingSlotType=i,s.target.value=this._slotType;return}this._slotType=i,this._slots=le(this._cadence),this._cadence==="custom"&&this._rebuildCustomSlots(),this._dirty=!0}}}
          >
            <option value="on_off">On/Off</option>
            <option value="color">Color</option>
            <option value="hvac">HVAC</option>
          </select>
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
          `:d}
        </div>

        ${this._slotType==="color"?c`
          <div class="form-group full-width">
            <label>Color Palette</label>
            <div class="palette-editor">
              ${this._palette.map((s,i)=>{const o=j(s);return c`
                <div class="palette-entry-chip"
                     style="background: ${ge(o)}"
                     title="${this._paletteEntryTooltip(o)}"
                     @click=${()=>{this._paletteEditIndex=i}}>
                  <span class="palette-mode-label">${this._paletteModeBadge(o.mode)}</span>
                  ${this._palette.length>1?c`
                    <button class="chip-remove" @click=${r=>{r.stopPropagation(),this._requestDeletePaletteEntry(i)}}>✕</button>
                  `:d}
                </div>
              `})}
              ${this._palette.length<10?c`
                <button class="palette-add" @click=${()=>{this._palette=[...this._palette,"#888888"],this._paletteEditIndex=this._palette.length-1,this._dirty=!0}}>+</button>
              `:d}
            </div>
            ${this._confirmDeletePaletteIndex!==null&&this._confirmDeletePaletteIndex<this._palette.length?this._renderPaletteDeleteConfirm(this._confirmDeletePaletteIndex):d}
            ${this._paletteEditIndex!==null&&this._paletteEditIndex<this._palette.length?this._renderPaletteEditForm(j(this._palette[this._paletteEditIndex]),this._paletteEditIndex):d}
          </div>
        `:d}

        ${this._slotType==="hvac"?c`
          <div class="form-group full-width">
            <label>HVAC Presets</label>
            <div class="hvac-presets">
              <div class="hvac-preset-list">
                ${this._hvacPresets.map((s,i)=>c`
                  <div
                    class="hvac-preset-chip"
                    style="background: ${s.color}"
                    title="${this._hvacPresetTooltip(s)}"
                    @click=${()=>{this._hvacEditIndex=i}}
                  >
                    ${s.icon?c`<mdi-icon class="chip-icon" .icon=${s.icon}></mdi-icon>`:d}
                    ${s.alias||this._hvacPresetLabel(s)}
                    ${this._hvacPresets.length>1?c`
                      <button class="chip-remove" @click=${o=>{o.stopPropagation(),this._requestDeletePreset(i)}}>✕</button>
                    `:d}
                  </div>
                `)}
                ${this._hvacPresets.length<20?c`
                  <button class="palette-add" @click=${this._addHvacPreset}>+</button>
                `:d}
              </div>
              ${this._confirmDeletePresetIndex!==null&&this._confirmDeletePresetIndex<this._hvacPresets.length?this._renderPresetDeleteConfirm(this._confirmDeletePresetIndex):d}
              ${this._hvacEditIndex!==null&&this._hvacEditIndex<this._hvacPresets.length?this._renderHvacEditForm(this._hvacPresets[this._hvacEditIndex],this._hvacEditIndex):d}
            </div>
          </div>
        `:d}
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
          @slots-changed=${s=>{this._slots=s.detail.slots,this._dirty=!0}}
        ></schedule-grid>
      </div>
      </div>
    `}_hvacPresetLabel(t){const e=[];return t.temperature!==null&&e.push(`${t.temperature}°`),t.hvac_mode&&e.push(t.hvac_mode),t.fan_mode&&e.push(t.fan_mode),e.join(" | ")||"Preset"}_hvacPresetTooltip(t){const e=[];return t.alias&&e.push(t.alias),t.temperature!==null&&e.push(`Temperature: ${t.temperature}°C`),t.hvac_mode&&e.push(`Mode: ${t.hvac_mode}`),t.fan_mode&&e.push(`Fan: ${t.fan_mode}`),e.join(`
`)}_addHvacPreset(){this._hvacPresets=[...this._hvacPresets,{temperature:22,hvac_mode:"cool",fan_mode:"auto",color:"#90caf9"}],this._hvacEditIndex=this._hvacPresets.length-1,this._dirty=!0}_presetSlotCount(t){const e=t+1;let s=0;for(const i of Object.values(this._slots))for(const o of i)o===e&&s++;return s}_renderPresetDeleteConfirm(t){var p;const e=this._hvacPresets[t],s=e.alias||this._hvacPresetLabel(e),i=this._presetSlotCount(t),r=this._confirmDeletePresetUsage.filter(f=>{var u;return f.id!==((u=this.schedule)==null?void 0:u.id)}),a=(p=this.schedule)==null?void 0:p.name,n=i>0;let l;if(n&&r.length>0){const f=r.map(u=>`'${u.name}'`).join(", ");l=c`This preset is in use by this schedule${a?` ('${a}')`:""} and ${f} — affected slots will be cleared.`}else if(n)l=c`This preset is used in <b>${i}</b> slot${i>1?"s":""} in this schedule — they will be cleared.`;else if(r.length>0){const f=r.map(u=>`'${u.name}'`).join(", ");l=c`This preset is in use by ${f} — affected slots will be cleared.`}else l=c`This preset is not used in any schedules.`;return c`
      <div class="preset-confirm-overlay">
        <p>Delete preset <b>${s}</b>?</p>
        <p>${l}</p>
        <div class="confirm-actions">
          <button class="secondary" @click=${()=>{this._confirmDeletePresetIndex=null}}>Cancel</button>
          <button class="danger" @click=${()=>{this._doRemoveHvacPreset(t)}}>Delete</button>
        </div>
      </div>
    `}async _requestDeletePreset(t){try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/hvac_preset_usage",index:t});this._confirmDeletePresetUsage=e.schedules??[]}catch{this._confirmDeletePresetUsage=[]}this._confirmDeletePresetIndex=t}_doRemoveHvacPreset(t){this._confirmDeletePresetIndex=null;const e=t+1,s={};for(const[i,o]of Object.entries(this._slots))s[i]=o.map(r=>r===e?0:r>e?r-1:r);this._slots=s,this._hvacPresets=this._hvacPresets.filter((i,o)=>o!==t),this._hvacEditIndex!==null&&(this._hvacEditIndex===t?this._hvacEditIndex=null:this._hvacEditIndex>t&&this._hvacEditIndex--),this._dirty=!0}_updateHvacPreset(t,e){const s=[...this._hvacPresets];s[t]={...s[t],...e},this._hvacPresets=s,this._dirty=!0}_renderHvacEditForm(t,e){return c`
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
          <button class="secondary" @click=${()=>{this._hvacEditIndex=null}}>Done</button>
        </div>
      </div>
    `}_paletteModeBadge(t){switch(t){case"crossfade":return"⇢";case"cycle":return"⟳";case"tv":return"📺";default:return""}}_paletteEntryTooltip(t){const e=[];return t.mode==="cycle"&&t.alias&&e.push(t.alias),e.push(t.color),t.mode!=="solid"&&e.push(`Mode: ${t.mode}`),t.mode==="cycle"&&t.colors&&(e.push(`Colors: ${t.colors.length}`),e.push(`Transition: ${t.transition??"snap"}`),e.push(`Rate: ${t.rate??1}x per block`)),e.join(`
`)}_renderPaletteDeleteConfirm(t){var p;const e=j(this._palette[t]),s=e.mode==="cycle"&&e.alias?e.alias:e.color,i=this._paletteSlotCount(t),r=this._confirmDeletePaletteUsage.filter(f=>{var u;return f.id!==((u=this.schedule)==null?void 0:u.id)}),a=(p=this.schedule)==null?void 0:p.name,n=i>0;let l;if(n&&r.length>0){const f=r.map(u=>`'${u.name}'`).join(", ");l=c`This preset is in use by this schedule${a?` ('${a}')`:""} and ${f} — affected slots will be cleared.`}else if(n)l=c`This preset is used in <b>${i}</b> slot${i>1?"s":""} in this schedule — they will be cleared.`;else if(r.length>0){const f=r.map(u=>`'${u.name}'`).join(", ");l=c`This preset is in use by ${f} — affected slots will be cleared.`}else l=c`This preset is not used in any schedules.`;return c`
      <div class="preset-confirm-overlay">
        <p>Delete color preset <b>${s}</b>?</p>
        <p>${l}</p>
        <div class="confirm-actions">
          <button class="secondary" @click=${()=>{this._confirmDeletePaletteIndex=null}}>Cancel</button>
          <button class="danger" @click=${()=>{this._doRemovePaletteEntry(t)}}>Delete</button>
        </div>
      </div>
    `}async _requestDeletePaletteEntry(t){try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/color_preset_usage",index:t});this._confirmDeletePaletteUsage=e.schedules??[]}catch{this._confirmDeletePaletteUsage=[]}this._confirmDeletePaletteIndex=t}_paletteSlotCount(t){const e=t+1;let s=0;for(const i of Object.values(this._slots))for(const o of i)o===e&&s++;return s}_doRemovePaletteEntry(t){this._confirmDeletePaletteIndex=null;const e=t+1,s={};for(const[i,o]of Object.entries(this._slots))s[i]=o.map(r=>r===e?0:r>e?r-1:r);this._slots=s,this._palette=this._palette.filter((i,o)=>o!==t),this._paletteEditIndex!==null&&(this._paletteEditIndex===t?this._paletteEditIndex=null:this._paletteEditIndex>t&&this._paletteEditIndex--),this._dirty=!0}_updatePaletteEntry(t,e){const s=[...this._palette],i=j(s[t]);s[t]={...i,...e},this._palette=s,this._dirty=!0}_renderPaletteEditForm(t,e){const s=t.colors&&t.colors.length>=2?Math.floor(900/(t.colors.length*5)):30;return c`
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
        `:d}

        ${t.mode==="tv"?c`
          <div class="palette-mode-help">
            Semi-randomly cycles through TV-like colors to simulate light from a television.
          </div>
        `:d}

        ${t.mode==="cycle"?c`
          <div class="cycle-config">
            <label>Cycle Colors</label>
            <div class="cycle-colors">
              ${(t.colors??[]).map((i,o)=>c`
                <div class="palette-entry">
                  <input
                    type="color"
                    .value=${i}
                    @input=${r=>{const a=[...t.colors??[]];a[o]=r.target.value,this._updatePaletteEntry(e,{colors:a})}}
                  />
                  ${(t.colors??[]).length>2?c`
                    <button class="palette-remove" @click=${()=>{const r=(t.colors??[]).filter((a,n)=>n!==o);this._updatePaletteEntry(e,{colors:r})}}>✕</button>
                  `:d}
                </div>
              `)}
              ${(t.colors??[]).length<10?c`
                <button class="palette-add" @click=${()=>{const i=[...t.colors??[],"#888888"];this._updatePaletteEntry(e,{colors:i})}}>+</button>
              `:d}
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
        `:d}

        <div class="hvac-edit-actions">
          <button class="secondary" @click=${()=>{this._paletteEditIndex=null}}>Done</button>
        </div>
      </div>
    `}_rebuildCustomSlots(){if(!this._startDate||!this._endDate)return;const t=Le(this._startDate,this._endDate),e={};for(const s of t)e[s]=this._slots[s]??new Array(xe).fill(0);this._slots=e}async _onSave(){var e,s,i,o;if(!this._name.trim()){this._showToast("Name is required","error");return}const t=this._entityIds;if(t.length===0){this._showToast("At least one entity ID is required","error");return}this._saving=!0;try{this._slotType==="hvac"&&await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/save_hvac_presets",hvac_presets:this._hvacPresets}),this._slotType==="color"&&await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/save_color_presets",color_presets:this._palette});const r={name:this._name.trim(),entity_ids:t,cadence:this._cadence,repeat:this._repeat,start_date:this._cadence==="custom"&&this._startDate||null,end_date:this._cadence==="custom"&&this._endDate||null,active:this._active,slot_minutes:15,slot_type:this._slotType,slots:this._slots,revert_delay:this._revertDelay};(e=this.schedule)!=null&&e.id&&(r.id=this.schedule.id);const a=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/save",schedule:r});a.conflicts&&a.conflicts.length>0?this._conflicts=a.conflicts:this._conflicts=[],((s=a.warnings)==null?void 0:s.length)>0&&this._showToast(a.warnings[0],"warning"),this._dirty=!1,this.dispatchEvent(new CustomEvent("schedule-saved",{detail:{id:((i=a.schedule)==null?void 0:i.id)??((o=this.schedule)==null?void 0:o.id)},bubbles:!0,composed:!0}))}catch(r){console.error("Failed to save schedule:",r),this._showToast("Failed to save schedule","error")}finally{this._saving=!1}}_onCancel(){if(this._dirty){this._confirmDiscard=!0;return}this.dispatchEvent(new CustomEvent("editor-cancel",{bubbles:!0,composed:!0}))}_toggleActive(){this._active=!this._active,this._dirty=!0}async _loadOverrides(){var t;if(!((t=this.schedule)!=null&&t.id)){this._overrides={},this._scheduledStates={},this._unavailableEntities=[];return}try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get_overrides",schedule_id:this.schedule.id});this._overrides=e.overrides??{},this._scheduledStates=e.scheduled_states??{},this._unavailableEntities=e.unavailable_entities??[]}catch{this._overrides={},this._scheduledStates={},this._unavailableEntities=[]}}async _onOverrideSet(t){var i;if(!((i=this.schedule)!=null&&i.id))return;const{entityId:e,state:s}=t.detail;try{await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/set_override",schedule_id:this.schedule.id,entity_id:e,state:s}),this._overrides={...this._overrides,[e]:s}}catch(o){console.error("Failed to set override:",o),this._showToast("Failed to set override","error")}}async _onOverrideClear(t){var s;if(!((s=this.schedule)!=null&&s.id))return;const{entityId:e}=t.detail;try{await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/clear_override",schedule_id:this.schedule.id,entity_id:e});const i={...this._overrides};delete i[e],this._overrides=i}catch(i){console.error("Failed to clear override:",i),this._showToast("Failed to clear override","error")}}_doDiscard(){this._confirmDiscard=!1,this._dirty=!1,this.dispatchEvent(new CustomEvent("editor-cancel",{bubbles:!0,composed:!0}))}_onDelete(){var t;(t=this.schedule)!=null&&t.id&&(this._confirmDelete=!0)}async _doDelete(){var t;if((t=this.schedule)!=null&&t.id){this._confirmDelete=!1,this._deleting=!0;try{await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/delete",schedule_id:this.schedule.id}),this.dispatchEvent(new CustomEvent("schedule-deleted",{bubbles:!0,composed:!0}))}catch(e){console.error("Failed to delete schedule:",e),this._showToast("Failed to delete schedule","error")}finally{this._deleting=!1}}}};_.styles=[F,k`
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
      .palette-entry-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        width: 36px;
        height: 36px;
        border-radius: 6px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border-color 0.15s, box-shadow 0.15s;
        position: relative;
        justify-content: center;
        box-sizing: border-box;
      }
      .palette-entry-chip:hover {
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
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
        border-radius: 50%;
        border: none;
        background: var(--error-color, #db4437);
        color: #fff;
        font-size: 9px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
      }
      .palette-edit-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        border: 1px solid var(--ss-border);
        border-radius: 8px;
        background: var(--secondary-background-color, #f5f5f5);
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
        padding: 0;
        border: 1px solid var(--ss-border);
        border-radius: 4px;
        cursor: pointer;
        background: none;
      }
      .palette-mode-help {
        font-size: 12px;
        color: var(--secondary-text-color, #727272);
        padding: 4px 0;
      }
      .cycle-config {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .cycle-colors {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
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
      .hvac-presets {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .hvac-preset-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      .hvac-preset-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        border-radius: 16px;
        font-size: 12px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border-color 0.15s, box-shadow 0.15s;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        position: relative;
      }
      .hvac-preset-chip:hover {
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      }
      .hvac-preset-chip .chip-icon {
        --mdi-icon-size: 16px;
        flex-shrink: 0;
      }
      .hvac-preset-chip .chip-remove {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: none;
        background: rgba(0,0,0,0.3);
        color: #fff;
        font-size: 9px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
        margin-left: 2px;
      }
      .hvac-preset-chip .chip-remove:hover {
        background: var(--error-color, #db4437);
      }
      .preset-confirm-overlay {
        padding: 12px;
        border: 1px solid var(--ss-border);
        border-radius: 8px;
        background: var(--secondary-background-color, #f5f5f5);
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
      .hvac-edit-form {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 8px;
        padding: 12px;
        border: 1px solid var(--ss-border);
        border-radius: 8px;
        background: var(--secondary-background-color, #f5f5f5);
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
        padding: 0;
        border: 1px solid var(--ss-border);
        border-radius: 4px;
        cursor: pointer;
        background: none;
        flex-shrink: 0;
      }
      .hvac-edit-form .color-alias-row .alias-input {
        flex: 1;
      }
      .hvac-edit-form .icon-picker-group {
        flex: 1;
        min-width: 160px;
      }
    `],v([m({attribute:!1})],_.prototype,"hass",2),v([m({attribute:!1})],_.prototype,"schedule",2),v([m({type:Boolean})],_.prototype,"isNew",2),v([m({attribute:!1})],_.prototype,"globalHvacPresets",2),v([m({attribute:!1})],_.prototype,"globalColorPresets",2),v([h()],_.prototype,"_name",2),v([h()],_.prototype,"_entityIds",2),v([h()],_.prototype,"_cadence",2),v([h()],_.prototype,"_repeat",2),v([h()],_.prototype,"_startDate",2),v([h()],_.prototype,"_endDate",2),v([h()],_.prototype,"_slots",2),v([h()],_.prototype,"_conflicts",2),v([h()],_.prototype,"_saving",2),v([h()],_.prototype,"_deleting",2),v([h()],_.prototype,"_dirty",2),v([h()],_.prototype,"_confirmDelete",2),v([h()],_.prototype,"_confirmDiscard",2),v([h()],_.prototype,"_active",2),v([h()],_.prototype,"_overrides",2),v([h()],_.prototype,"_scheduledStates",2),v([h()],_.prototype,"_unavailableEntities",2),v([h()],_.prototype,"_revertDelay",2),v([h()],_.prototype,"_slotType",2),v([h()],_.prototype,"_palette",2),v([h()],_.prototype,"_hvacPresets",2),v([h()],_.prototype,"_hvacEditIndex",2),v([h()],_.prototype,"_confirmDeletePresetIndex",2),v([h()],_.prototype,"_confirmDeletePresetUsage",2),v([h()],_.prototype,"_paletteEditIndex",2),v([h()],_.prototype,"_confirmDeletePaletteIndex",2),v([h()],_.prototype,"_confirmDeletePaletteUsage",2),v([h()],_.prototype,"_pendingSlotType",2),_=v([O("schedule-editor")],_);var Mt=Object.defineProperty,Ot=Object.getOwnPropertyDescriptor,S=(t,e,s,i)=>{for(var o=i>1?void 0:i?Ot(e,s):e,r=t.length-1,a;r>=0;r--)(a=t[r])&&(o=(i?a(e,s,o):a(o))||o);return i&&o&&Mt(e,s,o),o};return $.OnCuePanel=class extends x{constructor(){super(...arguments),this.narrow=!1,this._schedules=[],this._selectedSchedule=null,this._isNew=!1,this._loading=!0,this._sidebarOpen=!0,this._hvacPresets=[],this._colorPresets=[]}connectedCallback(){super.connectedCallback(),this._loadSchedules(),this._loadHvacPresets(),this._loadColorPresets()}render(){var e;return this._loading?c`<div class="loading">Loading schedules...</div>`:c`
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
            @schedule-saved=${this._onScheduleSaved}
            @schedule-deleted=${this._onScheduleDeleted}
            @editor-cancel=${this._onEditorCancel}
            @hvac-presets-changed=${this._onHvacPresetsChanged}
            @color-presets-changed=${this._onColorPresetsChanged}
          ></schedule-editor>
        </div>
      </div>
      ${this.narrow?c`
            <button class="toggle-sidebar" @click=${this._toggleSidebar}>
              ${this._sidebarOpen?"✕":"☰"}
            </button>
          `:d}
    `}async _loadSchedules(){try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/list"});this._schedules=e.schedules??[]}catch(e){console.error("Failed to load schedules:",e),this._schedules=[]}finally{this._loading=!1}}async _loadHvacPresets(){try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get_hvac_presets"});this._hvacPresets=e.hvac_presets??[]}catch(e){console.error("Failed to load HVAC presets:",e),this._hvacPresets=[]}}async _loadColorPresets(){try{const e=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get_color_presets"});this._colorPresets=e.color_presets??[]}catch(e){console.error("Failed to load color presets:",e),this._colorPresets=[]}}async _onScheduleSelected(e){const s=e.detail.id;try{const i=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get",schedule_id:s});this._selectedSchedule=i.schedule??null,this._isNew=!1}catch(i){console.error("Failed to load schedule:",i)}this.narrow&&(this._sidebarOpen=!1)}_onAddSchedule(){this._selectedSchedule=null,this._isNew=!0,this.narrow&&(this._sidebarOpen=!1)}async _onScheduleSaved(e){var i;await this._loadSchedules(),await this._loadHvacPresets(),await this._loadColorPresets();const s=(i=e.detail)==null?void 0:i.id;if(s)try{const o=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get",schedule_id:s});this._selectedSchedule=o.schedule??null,this._isNew=!1}catch{}}async _onScheduleDeleted(){this._selectedSchedule=null,this._isNew=!1,await this._loadSchedules()}_onEditorCancel(){this._isNew&&(this._isNew=!1,this._selectedSchedule=null)}_toggleSidebar(){this._sidebarOpen=!this._sidebarOpen}async _onToggleActive(e){var o;const{id:s,active:i}=e.detail;try{const a=(await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get",schedule_id:s})).schedule;if(!a)return;a.active=i,await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/save",schedule:a}),await this._loadSchedules(),((o=this._selectedSchedule)==null?void 0:o.id)===s&&(this._selectedSchedule={...this._selectedSchedule,active:i})}catch(r){console.error("Failed to toggle schedule active state:",r)}}async _onHvacPresetsChanged(){await this._loadHvacPresets()}async _onColorPresetsChanged(){await this._loadColorPresets()}},$.OnCuePanel.styles=[F,k`
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
    `],S([m({attribute:!1})],$.OnCuePanel.prototype,"hass",2),S([m({attribute:!1})],$.OnCuePanel.prototype,"panel",2),S([m({type:Boolean})],$.OnCuePanel.prototype,"narrow",2),S([h()],$.OnCuePanel.prototype,"_schedules",2),S([h()],$.OnCuePanel.prototype,"_selectedSchedule",2),S([h()],$.OnCuePanel.prototype,"_isNew",2),S([h()],$.OnCuePanel.prototype,"_loading",2),S([h()],$.OnCuePanel.prototype,"_sidebarOpen",2),S([h()],$.OnCuePanel.prototype,"_hvacPresets",2),S([h()],$.OnCuePanel.prototype,"_colorPresets",2),$.OnCuePanel=S([O("oncue-scheduler-panel")],$.OnCuePanel),Object.defineProperty($,Symbol.toStringTag,{value:"Module"}),$}({});
