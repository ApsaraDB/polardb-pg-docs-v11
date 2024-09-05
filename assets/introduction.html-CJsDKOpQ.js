import{_ as l,r,o as c,c as i,d as e,a as t,b as o}from"./app-4enb6FVN.js";const d="/polardb-pg-docs-v11/assets/software-level-2IGWP5LE.png",f={},_=t("h1",{id:"架构简介",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#架构简介"},[t("span",null,"架构简介")])],-1),h=t("p",null,"PolarDB for PostgreSQL 采用了基于 Shared-Storage 的存储计算分离架构。数据库由传统的 Share-Nothing 架构，转变成了 Shared-Storage 架构——由原来的 N 份计算 + N 份存储，转变成了 N 份计算 + 1 份存储；而 PostgreSQL 使用了传统的单体数据库架构，存储和计算耦合在一起。",-1),p=t("p",null,[t("img",{src:d,alt:"software-level"})],-1),m={href:"https://github.com/ApsaraDB/PolarDB-FileSystem",target:"_blank",rel:"noopener noreferrer"},u=t("sup",{class:"footnote-ref"},[t("a",{href:"#footnote1"},"[1]"),t("a",{class:"footnote-anchor",id:"footnote-ref1"})],-1),g=t("hr",{class:"footnotes-sep"},null,-1),S={class:"footnotes"},P={class:"footnotes-list"},b={id:"footnote1",class:"footnote-item"},v={href:"https://www.vldb.org/pvldb/vol11/p1849-cao.pdf",target:"_blank",rel:"noopener noreferrer"},B=t("a",{href:"#footnote-ref1",class:"footnote-backref"},"↩︎",-1);function N(s,k){const a=r("ArticleInfo"),n=r("ExternalLinkIcon");return c(),i("div",null,[_,e(a,{frontmatter:s.$frontmatter},null,8,["frontmatter"]),h,p,t("p",null,[o("为保证所有计算节点能够以相同的可见性视角访问分布式块存储设备，PolarDB-PG 需要使用分布式文件系统 "),t("a",m,[o("PolarDB File System（PFS）"),e(n)]),o(" 来访问块设备，其实现原理可参考发表在 2018 年 VLDB 上的论文"),u,o("；如果所有计算节点都可以本地访问同一个块存储设备，那么也可以不使用 PFS，直接使用本地的单机文件系统（如 ext4）。这是与 PostgreSQL 的不同点之一。")]),g,t("section",S,[t("ol",P,[t("li",b,[t("p",null,[t("a",v,[o("PolarFS: an ultra-low latency and failure resilient distributed file system for shared storage cloud database"),e(n)]),o(),B])])])])])}const L=l(f,[["render",N],["__file","introduction.html.vue"]]),w=JSON.parse('{"path":"/zh/deploying/introduction.html","title":"架构简介","lang":"zh-CN","frontmatter":{"author":"棠羽","date":"2022/05/09","minute":5},"headers":[],"git":{"updatedTime":1725527283000},"filePathRelative":"zh/deploying/introduction.md"}');export{L as comp,w as data};
