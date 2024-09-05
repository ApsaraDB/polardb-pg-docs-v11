import{_ as r,r as t,o as d,c,a as e,b as a,d as n,w as i,e as o}from"./app-4enb6FVN.js";const h={},p=o('<h1 id="贡献代码" tabindex="-1"><a class="header-anchor" href="#贡献代码"><span>贡献代码</span></a></h1><p>PolarDB for PostgreSQL 基于 PostgreSQL 和其它开源项目进行开发，我们的主要目标是为 PostgreSQL 建立一个更大的社区。我们欢迎来自社区的贡献者提交他们的代码或想法。在更远的未来，我们希望这个项目能够被来自阿里巴巴内部和外部的开发者共同管理。</p><h2 id="分支说明与管理方式" tabindex="-1"><a class="header-anchor" href="#分支说明与管理方式"><span>分支说明与管理方式</span></a></h2><ul><li><code>POLARDB_11_STABLE</code> 是 PolarDB 的稳定分支，只接受来自 <code>POLARDB_11_DEV</code> 的合并</li><li><code>POLARDB_11_DEV</code> 是 PolarDB 的稳定开发分支，接受来自开源社区的 PR 合并，以及内部开发者的直接推送</li></ul><p>新的代码将被合并到 <code>POLARDB_11_DEV</code> 上，再由内部开发者定期合并到 <code>POLARDB_11_STABLE</code> 上。</p><h2 id="贡献代码之前" tabindex="-1"><a class="header-anchor" href="#贡献代码之前"><span>贡献代码之前</span></a></h2>',6),u={href:"https://gist.github.com/alibaba-oss/151a13b0a72e44ba471119c7eb737d74",target:"_blank",rel:"noopener noreferrer"},g=e("h2",{id:"贡献流程",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#贡献流程"},[e("span",null,"贡献流程")])],-1),b=e("li",null,[a("在 "),e("code",null,"ApsaraDB/PolarDB-for-PostgreSQL"),a(" 仓库点击 "),e("code",null,"fork"),a(" 复制一个属于您自己的仓库")],-1),v=e("li",null,"向 PolarDB 官方源码仓库发起 pull request；如果 commit message 本身不能很好地表达您的贡献内容，您可以在 PR 中给出较为细节的描述",-1),_=e("li",null,"等待维护者评审您的代码，讨论并解决所有的评审意见",-1),m=e("li",null,"等待维护者合并您的代码",-1),f=e("h2",{id:"代码提交实例说明",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#代码提交实例说明"},[e("span",null,"代码提交实例说明")])],-1),k=e("h3",{id:"复制您自己的仓库",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#复制您自己的仓库"},[e("span",null,"复制您自己的仓库")])],-1),P={href:"https://github.com/ApsaraDB/PolarDB-for-PostgreSQL",target:"_blank",rel:"noopener noreferrer"},D=e("strong",null,"fork",-1),B=o(`<h3 id="克隆您的仓库到本地" tabindex="-1"><a class="header-anchor" href="#克隆您的仓库到本地"><span>克隆您的仓库到本地</span></a></h3><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/<span class="token operator">&lt;</span>your-github<span class="token operator">&gt;</span>/PolarDB-for-PostgreSQL.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="创建本地开发分支" tabindex="-1"><a class="header-anchor" href="#创建本地开发分支"><span>创建本地开发分支</span></a></h3><p>从稳定开发分支 <code>POLARDB_11_DEV</code> 上检出一个新的开发分支，假设这个分支名为 <code>dev</code>：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">git</span> checkout POLARDB_11_DEV
<span class="token function">git</span> checkout <span class="token parameter variable">-b</span> dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="在本地仓库修改代码并提交" tabindex="-1"><a class="header-anchor" href="#在本地仓库修改代码并提交"><span>在本地仓库修改代码并提交</span></a></h3><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">git</span> status
<span class="token function">git</span> <span class="token function">add</span> <span class="token operator">&lt;</span>files-to-change<span class="token operator">&gt;</span>
<span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;modification for dev&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="变基并提交到远程仓库" tabindex="-1"><a class="header-anchor" href="#变基并提交到远程仓库"><span>变基并提交到远程仓库</span></a></h3><p>首先点击您自己仓库页面上的 <code>Fetch upstream</code> 确保您的稳定开发分支与 PolarDB 官方仓库的稳定开发分支一致。然后将稳定开发分支上的最新修改拉取到本地：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">git</span> checkout POLARDB_11_DEV
<span class="token function">git</span> pull
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来将您的开发分支变基到目前的稳定开发分支，并解决冲突：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">git</span> checkout dev
<span class="token function">git</span> rebase POLARDB_11_DEV
-- 解决冲突 --
<span class="token function">git</span> push <span class="token parameter variable">-f</span> dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建-pull-request" tabindex="-1"><a class="header-anchor" href="#创建-pull-request"><span>创建 Pull Request</span></a></h3><p>点击 <strong>New pull request</strong> 或 <strong>Compare &amp; pull request</strong> 按钮，选择对 <code>ApsaraDB/PolarDB-for-PostgreSQL:POLARDB_11_DEV</code> 分支和 <code>&lt;your-github&gt;/PolarDB-for-PostgreSQL:dev</code> 分支进行比较，并撰写 PR 描述。</p><p>GitHub 会对您的 PR 进行自动化的回归测试，您的 PR 需要 100% 通过这些测试。</p><h3 id="解决代码评审中的问题" tabindex="-1"><a class="header-anchor" href="#解决代码评审中的问题"><span>解决代码评审中的问题</span></a></h3><p>您可以与维护者就代码中的问题进行讨论，并解决他们提出的评审意见。</p><h3 id="代码合并" tabindex="-1"><a class="header-anchor" href="#代码合并"><span>代码合并</span></a></h3><p>如果您的代码通过了测试和评审，PolarDB 的维护者将会把您的 PR 合并到稳定分支上。</p>`,19);function L(x,R){const s=t("ExternalLinkIcon"),l=t("RouteLink");return d(),c("div",null,[p,e("ul",null,[e("li",null,[a("签署 PolarDB for PostgreSQL 的 "),e("a",u,[a("CLA"),n(s)])])]),g,e("ul",null,[b,e("li",null,[a("查阅 "),n(l,{to:"/zh/deploying/deploy.html"},{default:i(()=>[a("进阶部署")]),_:1}),a(" 了解如何从源码编译开发 PolarDB")]),e("li",null,[a("向您的复制源码仓库推送代码，并确保代码符合我们的 "),n(l,{to:"/zh/contributing/coding-style.html"},{default:i(()=>[a("编码风格规范")]),_:1})]),v,_,m]),f,k,e("p",null,[a("在 "),e("a",P,[a("PolarDB for PostgreSQL"),n(s)]),a(" 的代码仓库页面上，点击右上角的 "),D,a(" 按钮复制您自己的 PolarDB 仓库。")]),B])}const S=r(h,[["render",L],["__file","contributing-polardb-kernel.html.vue"]]),E=JSON.parse('{"path":"/zh/contributing/contributing-polardb-kernel.html","title":"贡献代码","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"分支说明与管理方式","slug":"分支说明与管理方式","link":"#分支说明与管理方式","children":[]},{"level":2,"title":"贡献代码之前","slug":"贡献代码之前","link":"#贡献代码之前","children":[]},{"level":2,"title":"贡献流程","slug":"贡献流程","link":"#贡献流程","children":[]},{"level":2,"title":"代码提交实例说明","slug":"代码提交实例说明","link":"#代码提交实例说明","children":[{"level":3,"title":"复制您自己的仓库","slug":"复制您自己的仓库","link":"#复制您自己的仓库","children":[]},{"level":3,"title":"克隆您的仓库到本地","slug":"克隆您的仓库到本地","link":"#克隆您的仓库到本地","children":[]},{"level":3,"title":"创建本地开发分支","slug":"创建本地开发分支","link":"#创建本地开发分支","children":[]},{"level":3,"title":"在本地仓库修改代码并提交","slug":"在本地仓库修改代码并提交","link":"#在本地仓库修改代码并提交","children":[]},{"level":3,"title":"变基并提交到远程仓库","slug":"变基并提交到远程仓库","link":"#变基并提交到远程仓库","children":[]},{"level":3,"title":"创建 Pull Request","slug":"创建-pull-request","link":"#创建-pull-request","children":[]},{"level":3,"title":"解决代码评审中的问题","slug":"解决代码评审中的问题","link":"#解决代码评审中的问题","children":[]},{"level":3,"title":"代码合并","slug":"代码合并","link":"#代码合并","children":[]}]}],"git":{"updatedTime":1725527283000},"filePathRelative":"zh/contributing/contributing-polardb-kernel.md"}');export{S as comp,E as data};
