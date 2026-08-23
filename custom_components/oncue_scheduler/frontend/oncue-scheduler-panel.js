var HaOnCueSchedulerPanel=function(m){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Ct;const q=globalThis,Q=q.ShadowRoot&&(q.ShadyCSS===void 0||q.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,tt=Symbol(),dt=new WeakMap;let ct=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==tt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Q&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=dt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&dt.set(e,t))}return t}toString(){return this.cssText}};const Dt=r=>new ct(typeof r=="string"?r:r+"",void 0,tt),k=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new ct(e,r,tt)},Ot=(r,t)=>{if(Q)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=q.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},ht=Q?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Dt(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Mt,defineProperty:kt,getOwnPropertyDescriptor:Tt,getOwnPropertyNames:Rt,getOwnPropertySymbols:Nt,getPrototypeOf:zt}=Object,S=globalThis,pt=S.trustedTypes,Ut=pt?pt.emptyScript:"",et=S.reactiveElementPolyfillSupport,U=(r,t)=>r,F={toAttribute(r,t){switch(t){case Boolean:r=r?Ut:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},st=(r,t)=>!Mt(r,t),ut={attribute:!0,type:String,converter:F,reflect:!1,useDefault:!1,hasChanged:st};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),S.litPropertyMetadata??(S.litPropertyMetadata=new WeakMap);let T=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ut){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&kt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=Tt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){const a=i==null?void 0:i.call(this);n==null||n.call(this,o),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ut}static _$Ei(){if(this.hasOwnProperty(U("elementProperties")))return;const t=zt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(U("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(U("properties"))){const e=this.properties,s=[...Rt(e),...Nt(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(ht(i))}else t!==void 0&&e.push(ht(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ot(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:F).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n,o;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const a=s.getPropertyOptions(i),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)==null?void 0:n.fromAttribute)!==void 0?a.converter:F;this._$Em=i;const h=l.fromAttribute(e,a.type);this[i]=h??((o=this._$Ej)==null?void 0:o.get(i))??h,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){var o;if(t!==void 0){const a=this.constructor;if(i===!1&&(n=this[t]),s??(s=a.getPropertyOptions(t)),!((s.hasChanged??st)(n,e)||s.useDefault&&s.reflect&&n===((o=this._$Ej)==null?void 0:o.get(t))&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i){const{wrapped:a}=o,l=this[n];a!==!0||this._$AL.has(n)||l===void 0||this.C(n,void 0,o,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};T.elementStyles=[],T.shadowRootOptions={mode:"open"},T[U("elementProperties")]=new Map,T[U("finalized")]=new Map,et==null||et({ReactiveElement:T}),(S.reactiveElementVersions??(S.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const H=globalThis,_t=r=>r,K=H.trustedTypes,ft=K?K.createPolicy("lit-html",{createHTML:r=>r}):void 0,gt="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,yt="?"+A,Ht=`<${yt}>`,P=document,j=()=>P.createComment(""),L=r=>r===null||typeof r!="object"&&typeof r!="function",it=Array.isArray,jt=r=>it(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",rt=`[ 	
\f\r]`,I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,mt=/-->/g,vt=/>/g,C=RegExp(`>|${rt}(?:([^\\s"'>=/]+)(${rt}*=${rt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),bt=/'/g,$t=/"/g,wt=/^(?:script|style|textarea|title)$/i,Lt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),u=Lt(1),R=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),xt=new WeakMap,D=P.createTreeWalker(P,129);function St(r,t){if(!it(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ft!==void 0?ft.createHTML(t):t}const It=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=I;for(let a=0;a<e;a++){const l=r[a];let h,g,p=-1,x=0;for(;x<l.length&&(o.lastIndex=x,g=o.exec(l),g!==null);)x=o.lastIndex,o===I?g[1]==="!--"?o=mt:g[1]!==void 0?o=vt:g[2]!==void 0?(wt.test(g[2])&&(i=RegExp("</"+g[2],"g")),o=C):g[3]!==void 0&&(o=C):o===C?g[0]===">"?(o=i??I,p=-1):g[1]===void 0?p=-2:(p=o.lastIndex-g[2].length,h=g[1],o=g[3]===void 0?C:g[3]==='"'?$t:bt):o===$t||o===bt?o=C:o===mt||o===vt?o=I:(o=C,i=void 0);const E=o===C&&r[a+1].startsWith("/>")?" ":"";n+=o===I?l+Ht:p>=0?(s.push(h),l.slice(0,p)+gt+l.slice(p)+A+E):l+A+(p===-2?a:E)}return[St(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class B{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const a=t.length-1,l=this.parts,[h,g]=It(t,e);if(this.el=B.createElement(h,s),D.currentNode=this.el.content,e===2||e===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=D.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(const p of i.getAttributeNames())if(p.endsWith(gt)){const x=g[o++],E=i.getAttribute(p).split(A),X=/([.?@])?(.*)/.exec(x);l.push({type:1,index:n,name:X[2],strings:E,ctor:X[1]==="."?Yt:X[1]==="?"?Vt:X[1]==="@"?Wt:J}),i.removeAttribute(p)}else p.startsWith(A)&&(l.push({type:6,index:n}),i.removeAttribute(p));if(wt.test(i.tagName)){const p=i.textContent.split(A),x=p.length-1;if(x>0){i.textContent=K?K.emptyScript:"";for(let E=0;E<x;E++)i.append(p[E],j()),D.nextNode(),l.push({type:2,index:++n});i.append(p[x],j())}}}else if(i.nodeType===8)if(i.data===yt)l.push({type:2,index:n});else{let p=-1;for(;(p=i.data.indexOf(A,p+1))!==-1;)l.push({type:7,index:n}),p+=A.length-1}n++}}static createElement(t,e){const s=P.createElement("template");return s.innerHTML=t,s}}function N(r,t,e=r,s){var o,a;if(t===R)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=L(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((a=i==null?void 0:i._$AO)==null||a.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=N(r,i._$AS(r,t.values),i,s)),t}class Bt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??P).importNode(e,!0);D.currentNode=i;let n=D.nextNode(),o=0,a=0,l=s[0];for(;l!==void 0;){if(o===l.index){let h;l.type===2?h=new Y(n,n.nextSibling,this,t):l.type===1?h=new l.ctor(n,l.name,l.strings,this,t):l.type===6&&(h=new qt(n,this,t)),this._$AV.push(h),l=s[++a]}o!==(l==null?void 0:l.index)&&(n=D.nextNode(),o++)}return D.currentNode=P,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Y{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=N(this,t,e),L(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==R&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):jt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&L(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=B.createElement(St(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new Bt(i,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(t){let e=xt.get(t.strings);return e===void 0&&xt.set(t.strings,e=new B(t)),e}k(t){it(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new Y(this.O(j()),this.O(j()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t!==this._$AB;){const i=_t(t).nextSibling;_t(t).remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class J{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=N(this,t,e,0),o=!L(t)||t!==this._$AH&&t!==R,o&&(this._$AH=t);else{const a=t;let l,h;for(t=n[0],l=0;l<n.length-1;l++)h=N(this,a[s+l],e,l),h===R&&(h=this._$AH[l]),o||(o=!L(h)||h!==this._$AH[l]),h===d?t=d:t!==d&&(t+=(h??"")+n[l+1]),this._$AH[l]=h}o&&!i&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Yt extends J{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}}class Vt extends J{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}}class Wt extends J{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=N(this,t,e,0)??d)===R)return;const s=this._$AH,i=t===d&&s!==d||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==d&&(s===d||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class qt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){N(this,t)}}const ot=H.litHtmlPolyfillSupport;ot==null||ot(B,Y),(H.litHtmlVersions??(H.litHtmlVersions=[])).push("3.3.3");const Ft=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new Y(t.insertBefore(j(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const O=globalThis;class $ extends T{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ft(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return R}}$._$litElement$=!0,$.finalized=!0,(Ct=O.litElementHydrateSupport)==null||Ct.call(O,{LitElement:$});const nt=O.litElementPolyfillSupport;nt==null||nt({LitElement:$}),(O.litElementVersions??(O.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const V=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Kt={attribute:!0,type:String,converter:F,reflect:!1,hasChanged:st},Jt=(r=Kt,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(o,l,r,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,r,a),a}}}if(s==="setter"){const{name:o}=e;return function(a){const l=this[o];t.call(this,a),this.requestUpdate(o,l,r,!0,a)}}throw Error("Unsupported decorator location: "+s)};function y(r){return(t,e)=>typeof e=="object"?Jt(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function c(r){return y({...r,state:!0,attribute:!1})}const Z=k`
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
`;var Zt=Object.defineProperty,Gt=Object.getOwnPropertyDescriptor,at=(r,t,e,s)=>{for(var i=s>1?void 0:s?Gt(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Zt(t,e,i),i};let W=class extends ${constructor(){super(...arguments),this.schedules=[],this.selectedId=null}render(){return u`
      <div class="header">
        <h2>Schedules</h2>
        <button class="primary" @click=${this._onAdd}>+ Add</button>
      </div>
      <div class="list">
        ${this.schedules.length===0?u`<div class="empty">No schedules yet. Click + Add to create one.</div>`:this.schedules.map(r=>u`
                <div
                  class="item ${r.id===this.selectedId?"selected":""}"
                  @click=${()=>this._onSelect(r.id)}
                >
                  <div
                    class="status-dot ${r.active?"active":"paused"}"
                    title=${r.active?"Active":"Paused"}
                  ></div>
                  <div class="item-info">
                    <div class="item-name">${r.name}</div>
                    <div class="item-meta">
                      <span class="badge badge-${r.cadence}">${r.cadence}</span>
                      ${r.entity_ids.length} entity${r.entity_ids.length!==1?"ies":"y"}
                    </div>
                  </div>
                </div>
              `)}
      </div>
    `}_onSelect(r){this.dispatchEvent(new CustomEvent("schedule-selected",{detail:{id:r},bubbles:!0,composed:!0}))}_onAdd(){this.dispatchEvent(new CustomEvent("schedule-add",{bubbles:!0,composed:!0}))}};W.styles=[Z,k`
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
      }
      .status-dot.active {
        background: var(--success-color, #4caf50);
      }
      .status-dot.paused {
        background: var(--disabled-text-color, #bdbdbd);
      }
      .empty {
        padding: 24px 16px;
        text-align: center;
        color: var(--secondary-text-color, #727272);
        font-size: 14px;
      }
    `],at([y({type:Array})],W.prototype,"schedules",2),at([y({type:String})],W.prototype,"selectedId",2),W=at([V("schedule-list")],W);var Xt=Object.defineProperty,Qt=Object.getOwnPropertyDescriptor,b=(r,t,e,s)=>{for(var i=s>1?void 0:s?Qt(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Xt(t,e,i),i};const M=96,te=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],At=["0","1","2","3","4","5","6"];let v=class extends ${constructor(){super(...arguments),this.cadence="daily",this.slots={},this.customDates=[],this._dragActive=!1,this._dragValue=0,this._dragStartRow=-1,this._dragStartCol=-1,this._dragEndRow=-1,this._dragEndCol=-1,this._page=0,this._daysPerPage=7}get _dayKeys(){if(this.cadence==="daily")return["0"];if(this.cadence==="weekly")return At;const r=this.customDates;if(r.length<=this._daysPerPage)return r;const t=this._page*this._daysPerPage;return r.slice(t,t+this._daysPerPage)}get _totalPages(){return this.cadence!=="custom"?1:Math.max(1,Math.ceil(this.customDates.length/this._daysPerPage))}_dayLabel(r){return this.cadence==="daily"?"Every day":this.cadence==="weekly"?te[parseInt(r)]??r:r}render(){const r=this._dayKeys,t=Array.from({length:24},(e,s)=>s);return u`
      <div class="toolbar">
        <button class="secondary" @click=${()=>this._bulkSet(1)}>All On</button>
        <button class="secondary" @click=${()=>this._bulkSet(0)}>All Off</button>
        ${this.cadence==="weekly"?u`
              <button class="secondary" @click=${this._copyMondayToAll}>Copy Mon → All</button>
            `:d}
      </div>
      <div class="grid-container">
        <div class="grid" @mouseup=${this._onMouseUp} @mouseleave=${this._onMouseUp}>
          <!-- hour headers -->
          <div class="header-spacer"></div>
          ${t.map(e=>u`
              <div class="header-cell" style="grid-column: span 4">${String(e).padStart(2,"0")}</div>
            `)}

          <!-- rows -->
          ${r.map((e,s)=>this._renderRow(e,s))}
        </div>
      </div>
      ${this.cadence==="custom"&&this._totalPages>1?u`
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
    `}_renderRow(r,t){const e=this.slots[r]??new Array(M).fill(0);return u`
      <div class="row-label">${this._dayLabel(r)}</div>
      ${e.map((s,i)=>{const n=this._isInDragRegion(t,i);return u`
          <div
            class="cell ${s?"on":"off"} ${n?"drag-preview":""}"
            data-row=${t}
            data-col=${i}
            data-day=${r}
            title="${this._cellTooltip(i)}"
            @mousedown=${o=>this._onMouseDown(o,t,i,r)}
            @mouseenter=${o=>this._onMouseEnter(o,t,i)}
            @touchstart=${o=>this._onTouchStart(o,t,i,r)}
            @touchmove=${this._onTouchMove}
            @touchend=${this._onTouchEnd}
          ></div>
        `})}
    `}_cellTooltip(r){const t=Math.floor(r*15/60),e=r*15%60,s=Math.floor((r+1)*15/60),i=(r+1)*15%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")} – ${String(s).padStart(2,"0")}:${String(i).padStart(2,"0")}`}_isInDragRegion(r,t){if(!this._dragActive)return!1;const e=Math.min(this._dragStartRow,this._dragEndRow),s=Math.max(this._dragStartRow,this._dragEndRow),i=Math.min(this._dragStartCol,this._dragEndCol),n=Math.max(this._dragStartCol,this._dragEndCol);return r>=e&&r<=s&&t>=i&&t<=n}_onMouseDown(r,t,e,s){r.preventDefault();const i=this.slots[s]??new Array(M).fill(0);this._dragValue=i[e]?0:1,this._dragStartRow=t,this._dragStartCol=e,this._dragEndRow=t,this._dragEndCol=e,this._dragActive=!0}_onMouseEnter(r,t,e){this._dragActive&&(this._dragEndRow=t,this._dragEndCol=e)}_onMouseUp(){this._dragActive&&(this._applyDrag(),this._dragActive=!1)}_onTouchStart(r,t,e,s){r.preventDefault();const i=this.slots[s]??new Array(M).fill(0);this._dragValue=i[e]?0:1,this._dragStartRow=t,this._dragStartCol=e,this._dragEndRow=t,this._dragEndCol=e,this._dragActive=!0}_onTouchMove(r){var s;if(!this._dragActive)return;const t=r.touches[0],e=(s=this.shadowRoot)==null?void 0:s.elementFromPoint(t.clientX,t.clientY);(e==null?void 0:e.dataset.row)!==void 0&&(e==null?void 0:e.dataset.col)!==void 0&&(this._dragEndRow=parseInt(e.dataset.row),this._dragEndCol=parseInt(e.dataset.col))}_onTouchEnd(){this._dragActive&&(this._applyDrag(),this._dragActive=!1)}_applyDrag(){const r=this._dayKeys,t=Math.min(this._dragStartRow,this._dragEndRow),e=Math.max(this._dragStartRow,this._dragEndRow),s=Math.min(this._dragStartCol,this._dragEndCol),i=Math.max(this._dragStartCol,this._dragEndCol),n={...this.slots};for(let o=t;o<=e;o++){const a=r[o];if(!a)continue;const l=[...n[a]??new Array(M).fill(0)];for(let h=s;h<=i;h++)l[h]=this._dragValue;n[a]=l}this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:n},bubbles:!0,composed:!0}))}_bulkSet(r){const t=this.cadence==="custom"?this.customDates:this._dayKeys,e={};for(const s of t)e[s]=new Array(M).fill(r);this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:e},bubbles:!0,composed:!0}))}_copyMondayToAll(){const r=this.slots[0]??new Array(M).fill(0),t={};for(const e of At)t[e]=[...r];this.dispatchEvent(new CustomEvent("slots-changed",{detail:{slots:t},bubbles:!0,composed:!0}))}_prevPage(){this._page=Math.max(0,this._page-1)}_nextPage(){this._page=Math.min(this._totalPages-1,this._page+1)}};v.styles=[Z,k`
      :host {
        display: block;
      }
      .grid-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
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
        grid-template-columns: 100px repeat(${M}, var(--ss-cell-size));
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
      }
      .cell {
        width: var(--ss-cell-size);
        height: var(--ss-cell-size);
        border-radius: 2px;
        cursor: pointer;
        transition: background 0.1s;
      }
      .cell.on {
        background: var(--ss-cell-on);
      }
      .cell.off {
        background: var(--ss-cell-off);
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
    `],b([y({type:String})],v.prototype,"cadence",2),b([y({type:Object})],v.prototype,"slots",2),b([y({type:Array})],v.prototype,"customDates",2),b([c()],v.prototype,"_dragActive",2),b([c()],v.prototype,"_dragValue",2),b([c()],v.prototype,"_dragStartRow",2),b([c()],v.prototype,"_dragStartCol",2),b([c()],v.prototype,"_dragEndRow",2),b([c()],v.prototype,"_dragEndCol",2),b([c()],v.prototype,"_page",2),v=b([V("schedule-grid")],v);var ee=Object.defineProperty,se=Object.getOwnPropertyDescriptor,G=(r,t,e,s)=>{for(var i=s>1?void 0:s?se(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&ee(t,e,i),i};let z=class extends ${constructor(){super(...arguments),this.message="",this.type="info",this.visible=!1,this._timer=null}render(){return u`
      <div class="toast ${this.type}" @click=${this.dismiss}>
        ${this.message}
      </div>
    `}show(r,t="info"){this._timer&&clearTimeout(this._timer),this.message=r,this.type=t,this.visible=!0,this._timer=setTimeout(()=>this.dismiss(),5e3)}dismiss(){this.visible=!1,this._timer&&(clearTimeout(this._timer),this._timer=null)}};z.styles=k`
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
  `,G([y({type:String})],z.prototype,"message",2),G([y({type:String})],z.prototype,"type",2),G([y({type:Boolean,reflect:!0})],z.prototype,"visible",2),z=G([V("toast-notification")],z);var ie=Object.defineProperty,re=Object.getOwnPropertyDescriptor,f=(r,t,e,s)=>{for(var i=s>1?void 0:s?re(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&ie(t,e,i),i};const lt=96,oe=["0","1","2","3","4","5","6"];function Et(r){if(r==="daily")return{0:new Array(lt).fill(0)};if(r==="weekly"){const t={};for(const e of oe)t[e]=new Array(lt).fill(0);return t}return{}}function Pt(r,t){const e=[],s=new Date(r),i=new Date(t);for(;s<=i;)e.push(s.toISOString().slice(0,10)),s.setDate(s.getDate()+1);return e}let _=class extends ${constructor(){super(...arguments),this.schedule=null,this.isNew=!1,this._name="",this._entityIds="",this._cadence="daily",this._repeat=!0,this._startDate="",this._endDate="",this._slots={},this._conflicts=[],this._saving=!1,this._deleting=!1,this._dirty=!1,this._confirmDelete=!1,this._confirmDiscard=!1}willUpdate(r){r.has("schedule")&&(this._loadFromSchedule(),this._confirmDelete=!1,this._confirmDiscard=!1)}get _toast(){return this.renderRoot.querySelector("toast-notification")}_showToast(r,t="info"){var e;(e=this._toast)==null||e.show(r,t)}_loadFromSchedule(){this.schedule?(this._name=this.schedule.name,this._entityIds=this.schedule.entity_ids.join(`
`),this._cadence=this.schedule.cadence,this._repeat=this.schedule.repeat,this._startDate=this.schedule.start_date??"",this._endDate=this.schedule.end_date??"",this._slots=JSON.parse(JSON.stringify(this.schedule.slots))):(this._name="",this._entityIds="",this._cadence="daily",this._repeat=!0,this._startDate="",this._endDate="",this._slots=Et("daily")),this._dirty=!1,this._conflicts=[]}render(){if(!this.schedule&&!this.isNew)return u`<div class="empty-msg">Select a schedule or create a new one.</div>`;const r=this._cadence==="custom"&&this._startDate&&this._endDate?Pt(this._startDate,this._endDate):[],t=this._saving||this._deleting;return u`
      <toast-notification></toast-notification>
      <div class="editor-wrapper">
      ${t?u`<div class="loading-overlay"><div class="spinner"></div></div>`:d}
      <div class="editor-header">
        <h2>${this.isNew?"New Schedule":"Edit Schedule"}</h2>
        <div class="actions">
          ${this._confirmDiscard?u`
              <div class="inline-confirm">
                <span>Discard changes?</span>
                <button class="danger" @click=${this._doDiscard}>Yes</button>
                <button class="secondary" @click=${()=>{this._confirmDiscard=!1}}>No</button>
              </div>
            `:u`<button class="secondary" @click=${this._onCancel}>Cancel</button>`}
          ${this.isNew?d:this._confirmDelete?u`
                <div class="inline-confirm">
                  <span>Delete?</span>
                  <button class="danger" @click=${this._doDelete}>Yes</button>
                  <button class="secondary" @click=${()=>{this._confirmDelete=!1}}>No</button>
                </div>
              `:u`<button class="danger" @click=${this._onDelete}>Delete</button>`}
          <button class="primary" ?disabled=${t} @click=${this._onSave}>
            ${this._saving?"Saving...":"Save"}
          </button>
        </div>
      </div>

      ${this._conflicts.length>0?u`
            <div class="warning-banner">
              ⚠ Conflicts detected with:
              ${this._conflicts.map(e=>e.schedule_name).join(", ")}
            </div>
          `:d}

      <div class="form">
        <div class="form-group full-width">
          <label for="name">Name</label>
          <input
            id="name"
            type="text"
            .value=${this._name}
            @input=${e=>{this._name=e.target.value,this._dirty=!0}}
            placeholder="My Schedule"
          />
        </div>

        <div class="form-group full-width">
          <label for="entities">Entity IDs (one per line)</label>
          <textarea
            id="entities"
            .value=${this._entityIds}
            @input=${e=>{this._entityIds=e.target.value,this._dirty=!0}}
            placeholder="switch.living_room&#10;light.bedroom"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="cadence">Cadence</label>
          <select
            id="cadence"
            .value=${this._cadence}
            @change=${e=>{const s=e.target.value;this._cadence=s,this._slots=Et(s),this._dirty=!0}}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div class="form-group">
          <label>Slot Type</label>
          <input type="text" value="On/Off" disabled />
        </div>

        ${this._cadence==="custom"?u`
              <div class="checkbox-row">
                <input
                  type="checkbox"
                  id="repeat"
                  .checked=${this._repeat}
                  @change=${e=>{this._repeat=e.target.checked,this._dirty=!0}}
                />
                <label for="repeat" style="margin:0">Repeat</label>
              </div>
              <div class="form-group">
                <label for="start-date">Start Date</label>
                <input
                  id="start-date"
                  type="date"
                  .value=${this._startDate}
                  @change=${e=>{this._startDate=e.target.value,this._rebuildCustomSlots(),this._dirty=!0}}
                />
              </div>
              <div class="form-group">
                <label for="end-date">End Date</label>
                <input
                  id="end-date"
                  type="date"
                  .value=${this._endDate}
                  @change=${e=>{this._endDate=e.target.value,this._rebuildCustomSlots(),this._dirty=!0}}
                />
              </div>
            `:d}
      </div>

      <div class="grid-section">
        <h3>Time Slots (15-minute intervals)</h3>
        <schedule-grid
          .cadence=${this._cadence}
          .slots=${this._slots}
          .customDates=${r}
          @slots-changed=${e=>{this._slots=e.detail.slots,this._dirty=!0}}
        ></schedule-grid>
      </div>
      </div>
    `}_rebuildCustomSlots(){if(!this._startDate||!this._endDate)return;const r=Pt(this._startDate,this._endDate),t={};for(const e of r)t[e]=this._slots[e]??new Array(lt).fill(0);this._slots=t}async _onSave(){var t,e,s,i,n;if(!this._name.trim()){this._showToast("Name is required","error");return}const r=this._entityIds.split(/[\n,]+/).map(o=>o.trim()).filter(Boolean);if(r.length===0){this._showToast("At least one entity ID is required","error");return}this._saving=!0;try{const o={name:this._name.trim(),entity_ids:r,cadence:this._cadence,repeat:this._cadence==="custom"?this._repeat:!0,start_date:this._cadence==="custom"&&this._startDate||null,end_date:this._cadence==="custom"&&this._endDate||null,active:((t=this.schedule)==null?void 0:t.active)??!0,slot_minutes:15,slot_type:"on_off",slots:this._slots};(e=this.schedule)!=null&&e.id&&(o.id=this.schedule.id);const a=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/save",schedule:o});a.conflicts&&a.conflicts.length>0?this._conflicts=a.conflicts:this._conflicts=[],((s=a.warnings)==null?void 0:s.length)>0&&this._showToast(a.warnings[0],"warning"),this._dirty=!1,this.dispatchEvent(new CustomEvent("schedule-saved",{detail:{id:((i=a.schedule)==null?void 0:i.id)??((n=this.schedule)==null?void 0:n.id)},bubbles:!0,composed:!0}))}catch(o){console.error("Failed to save schedule:",o),this._showToast("Failed to save schedule","error")}finally{this._saving=!1}}_onCancel(){if(this._dirty){this._confirmDiscard=!0;return}this.dispatchEvent(new CustomEvent("editor-cancel",{bubbles:!0,composed:!0}))}_doDiscard(){this._confirmDiscard=!1,this._dirty=!1,this.dispatchEvent(new CustomEvent("editor-cancel",{bubbles:!0,composed:!0}))}_onDelete(){var r;(r=this.schedule)!=null&&r.id&&(this._confirmDelete=!0)}async _doDelete(){var r;if((r=this.schedule)!=null&&r.id){this._confirmDelete=!1,this._deleting=!0;try{await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/delete",schedule_id:this.schedule.id}),this.dispatchEvent(new CustomEvent("schedule-deleted",{bubbles:!0,composed:!0}))}catch(t){console.error("Failed to delete schedule:",t),this._showToast("Failed to delete schedule","error")}finally{this._deleting=!1}}}};_.styles=[Z,k`
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
      .checkbox-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-top: 20px;
      }
      .checkbox-row input[type="checkbox"] {
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
    `],f([y({attribute:!1})],_.prototype,"hass",2),f([y({attribute:!1})],_.prototype,"schedule",2),f([y({type:Boolean})],_.prototype,"isNew",2),f([c()],_.prototype,"_name",2),f([c()],_.prototype,"_entityIds",2),f([c()],_.prototype,"_cadence",2),f([c()],_.prototype,"_repeat",2),f([c()],_.prototype,"_startDate",2),f([c()],_.prototype,"_endDate",2),f([c()],_.prototype,"_slots",2),f([c()],_.prototype,"_conflicts",2),f([c()],_.prototype,"_saving",2),f([c()],_.prototype,"_deleting",2),f([c()],_.prototype,"_dirty",2),f([c()],_.prototype,"_confirmDelete",2),f([c()],_.prototype,"_confirmDiscard",2),_=f([V("schedule-editor")],_);var ne=Object.defineProperty,ae=Object.getOwnPropertyDescriptor,w=(r,t,e,s)=>{for(var i=s>1?void 0:s?ae(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&ne(t,e,i),i};return m.OnCuePanel=class extends ${constructor(){super(...arguments),this.narrow=!1,this._schedules=[],this._selectedSchedule=null,this._isNew=!1,this._loading=!0,this._sidebarOpen=!0}connectedCallback(){super.connectedCallback(),this._loadSchedules()}render(){var t;return this._loading?u`<div class="loading">Loading schedules...</div>`:u`
      <div class="layout">
        <div class="sidebar ${this._sidebarOpen?"":"collapsed"}">
          <schedule-list
            .schedules=${this._schedules}
            .selectedId=${((t=this._selectedSchedule)==null?void 0:t.id)??null}
            @schedule-selected=${this._onScheduleSelected}
            @schedule-add=${this._onAddSchedule}
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
      ${this.narrow?u`
            <button class="toggle-sidebar" @click=${this._toggleSidebar}>
              ${this._sidebarOpen?"✕":"☰"}
            </button>
          `:d}
    `}async _loadSchedules(){try{const t=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/list"});this._schedules=t.schedules??[]}catch(t){console.error("Failed to load schedules:",t),this._schedules=[]}finally{this._loading=!1}}async _onScheduleSelected(t){const e=t.detail.id;try{const s=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get",schedule_id:e});this._selectedSchedule=s.schedule??null,this._isNew=!1}catch(s){console.error("Failed to load schedule:",s)}this.narrow&&(this._sidebarOpen=!1)}_onAddSchedule(){this._selectedSchedule=null,this._isNew=!0,this.narrow&&(this._sidebarOpen=!1)}async _onScheduleSaved(t){var s;await this._loadSchedules();const e=(s=t.detail)==null?void 0:s.id;if(e)try{const i=await this.hass.connection.sendMessagePromise({type:"oncue_scheduler/get",schedule_id:e});this._selectedSchedule=i.schedule??null,this._isNew=!1}catch{}}async _onScheduleDeleted(){this._selectedSchedule=null,this._isNew=!1,await this._loadSchedules()}_onEditorCancel(){this._isNew&&(this._isNew=!1,this._selectedSchedule=null)}_toggleSidebar(){this._sidebarOpen=!this._sidebarOpen}},m.OnCuePanel.styles=[Z,k`
      :host {
        display: block;
        height: 100%;
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
    `],w([y({attribute:!1})],m.OnCuePanel.prototype,"hass",2),w([y({attribute:!1})],m.OnCuePanel.prototype,"panel",2),w([y({type:Boolean})],m.OnCuePanel.prototype,"narrow",2),w([c()],m.OnCuePanel.prototype,"_schedules",2),w([c()],m.OnCuePanel.prototype,"_selectedSchedule",2),w([c()],m.OnCuePanel.prototype,"_isNew",2),w([c()],m.OnCuePanel.prototype,"_loading",2),w([c()],m.OnCuePanel.prototype,"_sidebarOpen",2),m.OnCuePanel=w([V("oncue-scheduler-panel")],m.OnCuePanel),Object.defineProperty(m,Symbol.toStringTag,{value:"Module"}),m}({});
