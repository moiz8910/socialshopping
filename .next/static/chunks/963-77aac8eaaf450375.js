(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[963],{3963:function(e,t,r){Promise.resolve().then(r.t.bind(r,6656,23)),Promise.resolve().then(r.t.bind(r,6208,23)),Promise.resolve().then(r.t.bind(r,8169,23)),Promise.resolve().then(r.t.bind(r,3699,23)),Promise.resolve().then(r.bind(r,7303)),Promise.resolve().then(r.bind(r,3530)),Promise.resolve().then(r.bind(r,1726)),Promise.resolve().then(r.bind(r,1507)),Promise.resolve().then(r.bind(r,4361)),Promise.resolve().then(r.bind(r,610)),Promise.resolve().then(r.bind(r,4120)),Promise.resolve().then(r.bind(r,6097)),Promise.resolve().then(r.bind(r,2960)),Promise.resolve().then(r.bind(r,9031)),Promise.resolve().then(r.bind(r,6071)),Promise.resolve().then(r.bind(r,4790)),Promise.resolve().then(r.bind(r,9325)),Promise.resolve().then(r.bind(r,8080)),Promise.resolve().then(r.bind(r,888)),Promise.resolve().then(r.bind(r,2850)),Promise.resolve().then(r.bind(r,7446)),Promise.resolve().then(r.bind(r,4705)),Promise.resolve().then(r.bind(r,5966)),Promise.resolve().then(r.bind(r,9501)),Promise.resolve().then(r.bind(r,5229))},5229:function(e,t,r){"use strict";r.r(t),r.d(t,{ChatInput:function(){return S}});var n=r(7437),s=r(4578),i=r(9222),a=r(7220),o=r(1865),l=r(8110),c=r(9883),d=r(4033),u=r(603),m=r(3904),x=r(8316),f=r(6489),h=r(8568),v=r(6827),p=r(6435),g=r(2265),b=r(5050),j=r(306);let N=b.fC,y=b.xz,k=g.forwardRef((e,t)=>{let{className:r,align:s="center",sideOffset:i=4,...a}=e;return(0,n.jsx)(b.h_,{children:(0,n.jsx)(b.VY,{ref:t,align:s,sideOffset:i,className:(0,j.cn)("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",r),...a})})});k.displayName=b.VY.displayName;let w=e=>{let{onChange:t}=e,{resolvedTheme:r}=(0,p.F)();return(0,n.jsxs)(N,{children:[(0,n.jsx)(y,{children:(0,n.jsx)(f.Z,{className:"text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"})}),(0,n.jsx)(k,{side:"right",sideOffset:40,className:"bg-transparent border-none shadow-none drop-shadow-none mb-16",children:(0,n.jsx)(h.Z,{theme:r,data:v,onEmojiSelect:e=>t(e.native)})})]})},z=s.Ry({content:s.Z_().min(1)}),S=e=>{let{apiUrl:t,query:r,name:s,type:f}=e,{onOpen:h}=(0,x.d)(),v=(0,d.useRouter)(),p=(0,o.cI)({resolver:(0,l.F)(z),defaultValues:{content:""}}),g=p.formState.isSubmitting,b=async e=>{try{let n=a.Z.stringifyUrl({url:t,query:r});await i.Z.post(n,e),p.reset(),v.refresh()}catch(e){console.log(e)}};return(0,n.jsx)(u.l0,{...p,children:(0,n.jsx)("form",{onSubmit:p.handleSubmit(b),children:(0,n.jsx)(u.Wi,{control:p.control,name:"content",render:e=>{let{field:i}=e;return(0,n.jsx)(u.xJ,{children:(0,n.jsx)(u.NI,{children:(0,n.jsxs)("div",{className:"relative p-4 pb-6",children:[(0,n.jsx)("button",{type:"button",onClick:()=>h("messageFile",{apiUrl:t,query:r}),className:"absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center",children:(0,n.jsx)(c.Z,{className:"text-white dark:text-[#313338]"})}),(0,n.jsx)(m.I,{disabled:g,className:"px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200",placeholder:"Message ".concat("conversation"===f?s:"#"+s),...i}),(0,n.jsx)("div",{className:"absolute top-7 right-8",children:(0,n.jsx)(w,{onChange:e=>i.onChange("".concat(i.value," ").concat(e))})})]})})})}})})})}},9501:function(e,t,r){"use strict";r.r(t),r.d(t,{ChatMessages:function(){return V}});var n=r(7437),s=r(2265),i=r(4301),a=r(6264),o=r(4775),l=r(7220),c=r(6813),d=r(1736);let u=e=>{let{queryKey:t,apiUrl:r,paramKey:n,paramValue:s}=e,{isConnected:i}=(0,d.useSocket)(),a=async e=>{let{pageParam:t}=e,i=l.Z.stringifyUrl({url:r,query:{cursor:t,[n]:s}},{skipNull:!0}),a=await fetch(i);return a.json()},{data:o,fetchNextPage:u,hasNextPage:m,isFetchingNextPage:x,status:f}=(0,c.N)({queryKey:[t],queryFn:a,getNextPageParam:e=>null==e?void 0:e.nextCursor,refetchInterval:!i&&1e3});return{data:o,fetchNextPage:u,hasNextPage:m,isFetchingNextPage:x,status:f}};var m=r(165);let x=e=>{let{addKey:t,updateKey:r,queryKey:n}=e,{socket:i}=(0,d.useSocket)(),a=(0,m.NL)();(0,s.useEffect)(()=>{if(i)return i.on(r,e=>{a.setQueryData([n],t=>{if(!t||!t.pages||0===t.pages.length)return t;let r=t.pages.map(t=>({...t,items:t.items.map(t=>t.id===e.id?e:t)}));return{...t,pages:r}})}),i.on(t,e=>{a.setQueryData([n],t=>{if(!t||!t.pages||0===t.pages.length)return{pages:[{items:[e]}]};let r=[...t.pages];return r[0]={...r[0],items:[e,...r[0].items]},{...t,pages:r}})}),()=>{i.off(t),i.off(r)}},[a,t,n,i,r])},f=e=>{let{chatRef:t,bottomRef:r,shouldLoadMore:n,loadMore:i,count:a}=e,[o,l]=(0,s.useState)(!1);(0,s.useEffect)(()=>{let e=null==t?void 0:t.current,r=()=>{let t=null==e?void 0:e.scrollTop;0===t&&n&&i()};return null==e||e.addEventListener("scroll",r),()=>{null==e||e.removeEventListener("scroll",r)}},[n,i,t]),(0,s.useEffect)(()=>{let e=null==r?void 0:r.current,n=t.current;(()=>{if(!o&&e)return l(!0),!0;if(!n)return!1;let t=n.scrollHeight-n.scrollTop-n.clientHeight;return t<=100})()&&setTimeout(()=>{var e;null===(e=r.current)||void 0===e||e.scrollIntoView({behavior:"smooth"})},100)},[r,t,a,o])};var h=r(7562);let v=e=>{let{name:t,type:r}=e;return(0,n.jsxs)("div",{className:"space-y-2 px-4 mb-4",children:["channel"===r&&(0,n.jsx)("div",{className:"h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center",children:(0,n.jsx)(h.Z,{className:"h-12 w-12 text-white"})}),(0,n.jsxs)("p",{className:"text-xl md:text-3xl font-bold",children:["channel"===r?"Welcome to #":"",t]}),(0,n.jsx)("p",{className:"text-zinc-600 dark:text-zinc-400 text-sm",children:"channel"===r?"This is the start of the #".concat(t," channel."):"This is the start of your conversation with ".concat(t)})]})};var p=r(4578),g=r(9222),b=r(1865),j=r(8110),N=r(4059),y=r(6678),k=r(6165),w=r(8734),z=r(9617),S=r(4737),P=r(6691),C=r.n(P),R=r(4033),I=r(7070),Z=r(8166),M=r(306),E=r(603),F=r(3904),_=r(3762),D=r(8316);let T={GUEST:null,MODERATOR:(0,n.jsx)(y.Z,{className:"h-4 w-4 ml-2 text-indigo-500"}),ADMIN:(0,n.jsx)(k.Z,{className:"h-4 w-4 ml-2 text-rose-500"})},L=p.Ry({content:p.Z_().min(1)}),U=e=>{let{id:t,content:r,member:i,timestamp:a,fileUrl:o,deleted:c,currentMember:d,isUpdated:u,socketUrl:m,socketQuery:x}=e,[f,h]=(0,s.useState)(!1),{onOpen:v}=(0,D.d)(),p=(0,R.useParams)(),y=(0,R.useRouter)(),k=()=>{i.id!==d.id&&y.push("/servers/".concat(null==p?void 0:p.serverId,"/conversations/").concat(i.id))};(0,s.useEffect)(()=>{let e=e=>{("Escape"===e.key||27===e.keyCode)&&h(!1)};return window.addEventListener("keydown",e),()=>window.removeEventListener("keyDown",e)},[]);let P=(0,b.cI)({resolver:(0,j.F)(L),defaultValues:{content:r}}),U=P.formState.isSubmitting,V=async e=>{try{let r=l.Z.stringifyUrl({url:"".concat(m,"/").concat(t),query:x});await g.Z.patch(r,e),P.reset(),h(!1)}catch(e){console.log(e)}};(0,s.useEffect)(()=>{P.reset({content:r})},[r]);let A=null==o?void 0:o.split(".").pop(),q=d.role===N.MemberRole.ADMIN,H=d.role===N.MemberRole.MODERATOR,O=d.id===i.id,W=!c&&(q||H||O),X=!c&&O&&!o,Y="pdf"===A&&o;return(0,n.jsxs)("div",{className:"relative group flex items-center hover:bg-black/5 p-4 transition w-full",children:[(0,n.jsxs)("div",{className:"group flex gap-x-2 items-start w-full",children:[(0,n.jsx)("div",{onClick:k,className:"cursor-pointer hover:drop-shadow-md transition",children:(0,n.jsx)(I.Y,{src:i.profile.imageUrl})}),(0,n.jsxs)("div",{className:"flex flex-col w-full",children:[(0,n.jsxs)("div",{className:"flex items-center gap-x-2",children:[(0,n.jsxs)("div",{className:"flex items-center",children:[(0,n.jsx)("p",{onClick:k,className:"font-semibold text-sm hover:underline cursor-pointer",children:i.profile.name}),(0,n.jsx)(Z.M,{label:i.role,children:T[i.role]})]}),(0,n.jsx)("span",{className:"text-xs text-zinc-500 dark:text-zinc-400",children:a})]}),!Y&&o&&(0,n.jsx)("a",{href:o,target:"_blank",rel:"noopener noreferrer",className:"relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48",children:(0,n.jsx)(C(),{src:o,alt:r,fill:!0,className:"object-cover"})}),Y&&(0,n.jsxs)("div",{className:"relative flex items-center p-2 mt-2 rounded-md bg-background/10",children:[(0,n.jsx)(w.Z,{className:"h-10 w-10 fill-indigo-200 stroke-indigo-400"}),(0,n.jsx)("a",{href:o,target:"_blank",rel:"noopener noreferrer",className:"ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline",children:"PDF File"})]}),!o&&!f&&(0,n.jsxs)("p",{className:(0,M.cn)("text-sm text-zinc-600 dark:text-zinc-300",c&&"italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"),children:[r,u&&!c&&(0,n.jsx)("span",{className:"text-[10px] mx-2 text-zinc-500 dark:text-zinc-400",children:"(edited)"})]}),!o&&f&&(0,n.jsxs)(E.l0,{...P,children:[(0,n.jsxs)("form",{className:"flex items-center w-full gap-x-2 pt-2",onSubmit:P.handleSubmit(V),children:[(0,n.jsx)(E.Wi,{control:P.control,name:"content",render:e=>{let{field:t}=e;return(0,n.jsx)(E.xJ,{className:"flex-1",children:(0,n.jsx)(E.NI,{children:(0,n.jsx)("div",{className:"relative w-full",children:(0,n.jsx)(F.I,{disabled:U,className:"p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200",placeholder:"Edited message",...t})})})})}}),(0,n.jsx)(_.z,{disabled:U,size:"sm",variant:"primary",children:"Save"})]}),(0,n.jsx)("span",{className:"text-[10px] mt-1 text-zinc-400",children:"Press escape to cancel, enter to save"})]})]})]}),W&&(0,n.jsxs)("div",{className:"hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm",children:[X&&(0,n.jsx)(Z.M,{label:"Edit",children:(0,n.jsx)(z.Z,{onClick:()=>h(!0),className:"cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"})}),(0,n.jsx)(Z.M,{label:"Delete",children:(0,n.jsx)(S.Z,{onClick:()=>v("deleteMessage",{apiUrl:"".concat(m,"/").concat(t),query:x}),className:"cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"})})]})]})},V=e=>{var t,r,l,c,d;let{name:m,member:h,chatId:p,apiUrl:g,socketUrl:b,socketQuery:j,paramKey:N,paramValue:y,type:k}=e,w="chat:".concat(p),z="chat:".concat(p,":messages"),S="chat:".concat(p,":messages:update"),P=(0,s.useRef)(null),C=(0,s.useRef)(null),{data:R,fetchNextPage:I,hasNextPage:Z,isFetchingNextPage:M,status:E}=u({queryKey:w,apiUrl:g,paramKey:N,paramValue:y});return(x({queryKey:w,addKey:z,updateKey:S}),f({chatRef:P,bottomRef:C,loadMore:I,shouldLoadMore:!M&&!!Z,count:null!==(d=null==R?void 0:null===(l=R.pages)||void 0===l?void 0:null===(r=l[0])||void 0===r?void 0:null===(t=r.items)||void 0===t?void 0:t.length)&&void 0!==d?d:0}),"loading"===E)?(0,n.jsxs)("div",{className:"flex flex-col flex-1 justify-center items-center",children:[(0,n.jsx)(a.Z,{className:"h-7 w-7 text-zinc-500 animate-spin my-4"}),(0,n.jsx)("p",{className:"text-xs text-zinc-500 dark:text-zinc-400",children:"Loading messages..."})]}):"error"===E?(0,n.jsxs)("div",{className:"flex flex-col flex-1 justify-center items-center",children:[(0,n.jsx)(o.Z,{className:"h-7 w-7 text-zinc-500 my-4"}),(0,n.jsx)("p",{className:"text-xs text-zinc-500 dark:text-zinc-400",children:"Something went wrong!"})]}):(0,n.jsxs)("div",{ref:P,className:"flex-1 flex flex-col py-4 overflow-y-auto",children:[!Z&&(0,n.jsx)("div",{className:"flex-1"}),!Z&&(0,n.jsx)(v,{type:k,name:m}),Z&&(0,n.jsx)("div",{className:"flex justify-center",children:M?(0,n.jsx)(a.Z,{className:"h-6 w-6 text-zinc-500 animate-spin my-4"}):(0,n.jsx)("button",{onClick:()=>I(),className:"text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition",children:"Load previous messages"})}),(0,n.jsx)("div",{className:"flex flex-col-reverse mt-auto",children:null==R?void 0:null===(c=R.pages)||void 0===c?void 0:c.map((e,t)=>(0,n.jsx)(s.Fragment,{children:e.items.map(e=>(0,n.jsx)(U,{id:e.id,currentMember:h,member:e.member,content:e.content,fileUrl:e.fileUrl,deleted:e.deleted,timestamp:(0,i.Z)(new Date(e.createdAt),"d MMM yyyy, HH:mm"),isUpdated:e.updatedAt!==e.createdAt,socketUrl:b,socketQuery:j},e.id))},t))}),(0,n.jsx)("div",{ref:C})]})}},610:function(e,t,r){"use strict";r.r(t),r.d(t,{ChatVideoButton:function(){return c}});var n=r(7437),s=r(7220),i=r(4033),a=r(9292),o=r(8339),l=r(8166);let c=()=>{let e=(0,i.usePathname)(),t=(0,i.useRouter)(),r=(0,i.useSearchParams)(),c=null==r?void 0:r.get("video"),d=c?a.Z:o.Z;return(0,n.jsx)(l.M,{side:"bottom",label:c?"End video call":"Start video call",children:(0,n.jsx)("button",{onClick:()=>{let r=s.Z.stringifyUrl({url:e||"",query:{video:!c||void 0}},{skipNull:!0});t.push(r)},className:"hover:opacity-75 transition mr-4",children:(0,n.jsx)(d,{className:"h-6 w-6 text-zinc-500 dark:text-zinc-400"})})})}},4361:function(e,t,r){"use strict";r.r(t),r.d(t,{MediaRoom:function(){return l}});var n=r(7437),s=r(2265),i=r(8829);r(7957);var a=r(513),o=r(6264);let l=e=>{let{chatId:t,video:r,audio:l}=e,{user:c}=(0,a.aF)(),[d,u]=(0,s.useState)("");return((0,s.useEffect)(()=>{if(!(null==c?void 0:c.firstName)||!(null==c?void 0:c.lastName))return;let e="".concat(c.firstName," ").concat(c.lastName);(async()=>{try{let r=await fetch("/api/livekit?room=".concat(t,"&username=").concat(e)),n=await r.json();u(n.token)}catch(e){console.log(e)}})()},[null==c?void 0:c.firstName,null==c?void 0:c.lastName,t]),""===d)?(0,n.jsxs)("div",{className:"flex flex-col flex-1 justify-center items-center",children:[(0,n.jsx)(o.Z,{className:"h-7 w-7 text-zinc-500 animate-spin my-4"}),(0,n.jsx)("p",{className:"text-xs text-zinc-500 dark:text-zinc-400",children:"Loading..."})]}):(0,n.jsx)(i.IC,{"data-lk-theme":"default",serverUrl:"wss://social-shopping-7luz1fbu.livekit.cloud",token:d,connect:!0,video:r,audio:l,children:(0,n.jsx)(i.zc,{})})}},2960:function(e,t,r){"use strict";r.r(t),r.d(t,{ModeToggle:function(){return c}});var n=r(7437);r(2265);var s=r(4135),i=r(3088),a=r(6435),o=r(3762),l=r(6592);function c(){let{setTheme:e}=(0,a.F)();return(0,n.jsxs)(l.h_,{children:[(0,n.jsx)(l.$F,{asChild:!0,children:(0,n.jsxs)(o.z,{className:"bg-transparent border-0",variant:"outline",size:"icon",children:[(0,n.jsx)(s.Z,{className:"h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"}),(0,n.jsx)(i.Z,{className:"absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"}),(0,n.jsx)("span",{className:"sr-only",children:"Toggle theme"})]})}),(0,n.jsxs)(l.AW,{align:"end",children:[(0,n.jsx)(l.Xi,{onClick:()=>e("light"),children:"Light"}),(0,n.jsx)(l.Xi,{onClick:()=>e("dark"),children:"Dark"}),(0,n.jsx)(l.Xi,{onClick:()=>e("system"),children:"System"})]})]})}},4120:function(e,t,r){"use strict";r.r(t),r.d(t,{NavigationAction:function(){return o}});var n=r(7437),s=r(9883),i=r(8166),a=r(8316);let o=()=>{let{onOpen:e}=(0,a.d)();return(0,n.jsx)("div",{children:(0,n.jsx)(i.M,{side:"right",align:"center",label:"Add a server",children:(0,n.jsx)("button",{onClick:()=>e("createServer"),className:"group flex items-center",children:(0,n.jsx)("div",{className:"flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500",children:(0,n.jsx)(s.Z,{className:"group-hover:text-white transition text-emerald-500",size:25})})})})})}},6097:function(e,t,r){"use strict";r.r(t),r.d(t,{NavigationItem:function(){return c}});var n=r(7437),s=r(6691),i=r.n(s),a=r(4033),o=r(306),l=r(8166);let c=e=>{let{id:t,imageUrl:r,name:s}=e,c=(0,a.useParams)(),d=(0,a.useRouter)();return(0,n.jsx)(l.M,{side:"right",align:"center",label:s,children:(0,n.jsxs)("button",{onClick:()=>{d.push("/servers/".concat(t))},className:"group relative flex items-center",children:[(0,n.jsx)("div",{className:(0,o.cn)("absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",(null==c?void 0:c.serverId)!==t&&"group-hover:h-[20px]",(null==c?void 0:c.serverId)===t?"h-[36px]":"h-[8px]")}),(0,n.jsx)("div",{className:(0,o.cn)("relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",(null==c?void 0:c.serverId)===t&&"bg-primary/10 text-primary rounded-[16px]"),children:(0,n.jsx)(i(),{fill:!0,src:r,alt:"Channel"})})]})})}},1736:function(e,t,r){"use strict";r.r(t),r.d(t,{SocketProvider:function(){return c},useSocket:function(){return l}});var n=r(7437),s=r(2265),i=r(3388),a=r(2601);let o=(0,s.createContext)({socket:null,isConnected:!1}),l=()=>(0,s.useContext)(o),c=e=>{let{children:t}=e,[r,l]=(0,s.useState)(null),[c,d]=(0,s.useState)(!1);return(0,s.useEffect)(()=>{let e=new i.io(a.env.NEXT_PUBLIC_SITE_URL,{path:"/api/socket/io",addTrailingSlash:!1});return e.on("connect",()=>{d(!0)}),e.on("disconnect",()=>{d(!1)}),l(e),()=>{e.disconnect()}},[]),(0,n.jsx)(o.Provider,{value:{socket:r,isConnected:c},children:t})}},4705:function(e,t,r){"use strict";r.r(t),r.d(t,{SocketIndicator:function(){return c}});var n=r(7437),s=r(1736);r(2265);var i=r(6061),a=r(306);let o=(0,i.j)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground"}},defaultVariants:{variant:"default"}});function l(e){let{className:t,variant:r,...s}=e;return(0,n.jsx)("div",{className:(0,a.cn)(o({variant:r}),t),...s})}let c=()=>{let{isConnected:e}=(0,s.useSocket)();return e?(0,n.jsx)(l,{variant:"outline",className:"bg-emerald-600 text-white border-none",children:"Live: Real-time updates"}):(0,n.jsx)(l,{variant:"outline",className:"bg-yellow-600 text-white border-none",children:"Fallback: Polling every 1s"})}},3762:function(e,t,r){"use strict";r.d(t,{z:function(){return c}});var n=r(7437),s=r(2265),i=r(7256),a=r(6061),o=r(306);let l=(0,a.j)("inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline",primary:"bg-indigo-500 text-white hover:bg-indigo-500/90"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),c=s.forwardRef((e,t)=>{let{className:r,variant:s,size:a,asChild:c=!1,...d}=e,u=c?i.g7:"button";return(0,n.jsx)(u,{className:(0,o.cn)(l({variant:s,size:a,className:r})),ref:t,...d})});c.displayName="Button"},603:function(e,t,r){"use strict";r.d(t,{NI:function(){return v},Wi:function(){return u},l0:function(){return c},lX:function(){return h},xJ:function(){return f},zG:function(){return g}});var n=r(7437),s=r(2265),i=r(7256),a=r(1865),o=r(306),l=r(7764);let c=a.RV,d=s.createContext({}),u=e=>{let{...t}=e;return(0,n.jsx)(d.Provider,{value:{name:t.name},children:(0,n.jsx)(a.Qr,{...t})})},m=()=>{let e=s.useContext(d),t=s.useContext(x),{getFieldState:r,formState:n}=(0,a.Gc)(),i=r(e.name,n);if(!e)throw Error("useFormField should be used within <FormField>");let{id:o}=t;return{id:o,name:e.name,formItemId:"".concat(o,"-form-item"),formDescriptionId:"".concat(o,"-form-item-description"),formMessageId:"".concat(o,"-form-item-message"),...i}},x=s.createContext({}),f=s.forwardRef((e,t)=>{let{className:r,...i}=e,a=s.useId();return(0,n.jsx)(x.Provider,{value:{id:a},children:(0,n.jsx)("div",{ref:t,className:(0,o.cn)("space-y-2",r),...i})})});f.displayName="FormItem";let h=s.forwardRef((e,t)=>{let{className:r,...s}=e,{error:i,formItemId:a}=m();return(0,n.jsx)(l._,{ref:t,className:(0,o.cn)(i&&"text-destructive",r),htmlFor:a,...s})});h.displayName="FormLabel";let v=s.forwardRef((e,t)=>{let{...r}=e,{error:s,formItemId:a,formDescriptionId:o,formMessageId:l}=m();return(0,n.jsx)(i.g7,{ref:t,id:a,"aria-describedby":s?"".concat(o," ").concat(l):"".concat(o),"aria-invalid":!!s,...r})});v.displayName="FormControl";let p=s.forwardRef((e,t)=>{let{className:r,...s}=e,{formDescriptionId:i}=m();return(0,n.jsx)("p",{ref:t,id:i,className:(0,o.cn)("text-sm text-muted-foreground",r),...s})});p.displayName="FormDescription";let g=s.forwardRef((e,t)=>{let{className:r,children:s,...i}=e,{error:a,formMessageId:l}=m(),c=a?String(null==a?void 0:a.message):s;return c?(0,n.jsx)("p",{ref:t,id:l,className:(0,o.cn)("text-sm font-medium text-destructive",r),...i,children:c}):null});g.displayName="FormMessage"},3904:function(e,t,r){"use strict";r.d(t,{I:function(){return a}});var n=r(7437),s=r(2265),i=r(306);let a=s.forwardRef((e,t)=>{let{className:r,type:s,...a}=e;return(0,n.jsx)("input",{type:s,className:(0,i.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",r),ref:t,...a})});a.displayName="Input"},7764:function(e,t,r){"use strict";r.d(t,{_:function(){return c}});var n=r(7437),s=r(2265),i=r(6743),a=r(6061),o=r(306);let l=(0,a.j)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),c=s.forwardRef((e,t)=>{let{className:r,...s}=e;return(0,n.jsx)(i.f,{ref:t,className:(0,o.cn)(l(),r),...s})});c.displayName=i.f.displayName},7446:function(e,t,r){"use strict";r.r(t),r.d(t,{Sheet:function(){return c},SheetClose:function(){return u},SheetContent:function(){return h},SheetDescription:function(){return b},SheetFooter:function(){return p},SheetHeader:function(){return v},SheetTitle:function(){return g},SheetTrigger:function(){return d}});var n=r(7437),s=r(2265),i=r(8712),a=r(6061),o=r(2549),l=r(306);let c=i.fC,d=i.xz,u=i.x8,m=e=>{let{className:t,...r}=e;return(0,n.jsx)(i.h_,{className:(0,l.cn)(t),...r})};m.displayName=i.h_.displayName;let x=s.forwardRef((e,t)=>{let{className:r,...s}=e;return(0,n.jsx)(i.aV,{className:(0,l.cn)("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",r),...s,ref:t})});x.displayName=i.aV.displayName;let f=(0,a.j)("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",{variants:{side:{top:"inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",bottom:"inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",left:"inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",right:"inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"}},defaultVariants:{side:"right"}}),h=s.forwardRef((e,t)=>{let{side:r="right",className:s,children:a,...c}=e;return(0,n.jsxs)(m,{children:[(0,n.jsx)(x,{}),(0,n.jsxs)(i.VY,{ref:t,className:(0,l.cn)(f({side:r}),s),...c,children:[a,(0,n.jsxs)(i.x8,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",children:[(0,n.jsx)(o.Z,{className:"h-4 w-4"}),(0,n.jsx)("span",{className:"sr-only",children:"Close"})]})]})]})});h.displayName=i.VY.displayName;let v=e=>{let{className:t,...r}=e;return(0,n.jsx)("div",{className:(0,l.cn)("flex flex-col space-y-2 text-center sm:text-left",t),...r})};v.displayName="SheetHeader";let p=e=>{let{className:t,...r}=e;return(0,n.jsx)("div",{className:(0,l.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",t),...r})};p.displayName="SheetFooter";let g=s.forwardRef((e,t)=>{let{className:r,...s}=e;return(0,n.jsx)(i.Dx,{ref:t,className:(0,l.cn)("text-lg font-semibold text-foreground",r),...s})});g.displayName=i.Dx.displayName;let b=s.forwardRef((e,t)=>{let{className:r,...s}=e;return(0,n.jsx)(i.dk,{ref:t,className:(0,l.cn)("text-sm text-muted-foreground",r),...s})});b.displayName=i.dk.displayName}}]);