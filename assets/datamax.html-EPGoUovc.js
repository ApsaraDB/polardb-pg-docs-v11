import{_ as i,r as l,o as c,c as d,d as s,a,w as t,e as m,b as e}from"./app-4enb6FVN.js";const u="/polardb-pg-docs-v11/assets/datamax_availability_architecture-CRBn1BW0.png",_="/polardb-pg-docs-v11/assets/datamax_realization_1-gPIenHjS.png",k="/polardb-pg-docs-v11/assets/datamax_realization_2-Ddlv7ozv.png",x="/polardb-pg-docs-v11/assets/datamax_availability_1-C2YmykBT.png",g="/polardb-pg-docs-v11/assets/datamax_availability_2-V1IXEWq_.png",h={},y=a("h1",{id:"datamax-日志节点",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#datamax-日志节点"},[a("span",null,"DataMax 日志节点")])],-1),v={class:"table-of-contents"},b=m('<h2 id="术语" tabindex="-1"><a class="header-anchor" href="#术语"><span>术语</span></a></h2><ul><li>RPO (Recovery Point Objective)：数据恢复点目标，指业务系统所能容忍的数据丢失量。</li><li>AZ (Availability Zone)：可用区，指同一个地域内电力和网络相互独立的区域，可用区之间可以做到故障隔离。</li></ul><h2 id="背景" tabindex="-1"><a class="header-anchor" href="#背景"><span>背景</span></a></h2><p>在高可用的场景中，为保证 RPO = 0，主库和备库之间需配置为同步复制模式。但当主备库距离较远时，同步复制的方式会存在较大延迟，从而对主库性能带来较大影响。异步复制对主库的性能影响较小，但会带来一定程度的数据丢失。PolarDB for PostgreSQL 采用基于共享存储的一写多读架构，可同时提供 AZ 内 / 跨 AZ / 跨域级别的高可用。为了减少日志同步对主库的影响，PolarDB for PostgreSQL 引入了 DataMax 节点。在进行跨 AZ 甚至跨域同步时，DataMax 节点可以作为主库日志的中转节点，能够以较低成本实现零数据丢失的同时，降低日志同步对主库性能的影响。</p><h2 id="原理" tabindex="-1"><a class="header-anchor" href="#原理"><span>原理</span></a></h2><h3 id="datamax-高可用架构" tabindex="-1"><a class="header-anchor" href="#datamax-高可用架构"><span>DataMax 高可用架构</span></a></h3><p>PolarDB for PostgreSQL 基于物理流复制实现主备库之间的数据同步，主库与备库的流复制模式分为 <strong>同步模式</strong> 及 <strong>异步模式</strong> 两种：</p><ul><li><strong>异步模式</strong>：主库事务提交仅需等待对应 WAL 日志写入本地磁盘文件后，即可进行事务提交的后续操作，备库状态对主库性能无影响；但异步模式下无法保证 RPO = 0，备库相较于主库存在一定的延迟，若主库所在集群出现故障，切换至备库可能存在数据丢失的问题；</li><li><strong>同步模式</strong>：主库及备库之间的同步模式包含不同的级别，当设置 <code>synchronous_standby_names</code> 参数开启备库同步后，可以通过 <code>synchronous_commit</code> 参数设置主库及备库之间的同步级别，包括： <ul><li><code>remote_write</code>：主库的事务提交需等待对应 WAL 日志写入主库磁盘文件及备库的系统缓存中后，才能进行事务提交的后续操作；</li><li><code>on</code>：主库的事务提交需等待对应 WAL 日志已写入主库及备库的磁盘文件中后，才能进行事务提交的后续操作；</li><li><code>remote_apply</code>：主库的事务提交需等待对应 WAL 日志写入主库及备库的磁盘文件中，并且备库已经回放完相应 WAL 日志使备库上的查询对该事务可见后，才能进行事务提交的后续操作。</li></ul></li></ul><p>同步模式保证了主库的事务提交操作需等待备库接收到对应的 WAL 日志数据之后才可执行，实现了主库与备库之间的零数据丢失，可保证 RPO = 0。然而，该模式下主库的事务提交操作能否继续进行依赖于备库的 WAL 日志接收结果，当主备之间距离较远导致传输延迟较大时，同步模式会对主库的性能带来影响。极端情况下，若备库异常崩溃，则主库会一直阻塞等待备库，导致无法正常提供服务。</p><p>针对传统主备模式下同步复制对主库性能影响较大的问题，PolarDB for PostgreSQL 新增了 DataMax 节点用于实现远程同步，该模式下的高可用架构如下所示：</p><p><img src="'+u+'" alt="dma-arch"></p><p>其中：</p><ol><li>一个数据库集群部署在一个可用区内，不同的集群之间互为灾备，以主备模式保证跨 AZ / 跨域级别的高可用；</li><li>单个数据库集群内为一写多读架构， Primary 节点和 Replica 节点共享同一份存储，有效降低存储成本；同时 Replica 节点还可以实现单个 AZ 内计算节点的高可用；</li><li>DataMax 节点与集群内的 Primary 节点部署在同一个可用区内： <ul><li>DataMax 节点只接收并保存 Primary 节点的 WAL 日志文件，但不对日志进行回放操作，也不保存 Primary 节点的数据文件，降低存储成本；</li><li>DataMax 节点与 Primary 节点的数据不共享，两者的存储设备彼此隔离，防止计算集群存储异常导致 Primary 节点与 DataMax 节点保存的日志同时丢失；</li><li>DataMax 节点与 Primary 节点之间为 <strong>同步复制</strong> 模式，确保 RPO = 0；DataMax 节点部署在距离 Primary 节点较近的区域，通常与 Primary 节点位于同一可用区，最小化日志同步对 Primary 节点带来的性能影响；</li><li>DataMax 节点将其接收的 WAL 日志发送至其他可用区的 Standby 节点，Standby 节点接收并回放 DataMax 节点的日志，实现与 Primary 节点（主库）的数据同步；Standby 节点与 DataMax 节点之间可设置为异步流复制模式，通过 DataMax 节点可分流 Primary 节点向多个备份数据库传输 WAL 日志的开销。</li></ul></li></ol><h3 id="datamax-实现" tabindex="-1"><a class="header-anchor" href="#datamax-实现"><span>DataMax 实现</span></a></h3><p>DataMax 是一种新的节点角色，用户需要通过配置文件来标识当前节点是否为 DataMax 节点。DataMax 模式下，Startup 进程在回放完 DataMax 节点自身日志之后，从 <code>PM_HOT_STANDBY</code> 进入到 <code>PM_DATAMAX</code> 模式。<code>PM_DATAMAX</code> 模式下，Startup 进程仅进行相关信号及状态的处理，并通知 Postmaster 进程启动流复制，Startup 进程不再进行日志回放的操作。因此 DataMax 节点不会保存 Primary 节点的数据文件，从而降低了存储成本。</p><p><img src="'+_+'" alt="datamax-impl"></p><p>如上图所示，DataMax 节点通过 WalReceiver 进程向 Primary 节点发起流复制请求，接收并保存 Primary 节点发送的 WAL 日志信息；同时通过 WalSender 进程将所接收的主库 WAL 日志发送给异地的备库节点；备库节点接收到 WAL 日志后，通知其 Startup 进程进行日志回放，从而实现备库节点与 Primary 节点的数据同步。</p><p>DataMax 节点在数据目录中新增了 <code>polar_datamax/</code> 目录，用于保存所接收的主库 WAL 日志。DataMax 节点自身的 WAL 日志仍保存在原始目录下，两者的 WAL 日志不会相互覆盖，DataMax 节点也可以有自身的独有数据。</p><p>由于 DataMax 节点不会回放 Primary 节点的日志数据，在 DataMax 节点因为异常原因需要重启恢复时，就有了日志起始位点的问题。DataMax 节点通过 <code>polar_datamax_meta</code> 元数据文件存储相关的位点信息，以此来确认运行的起始位点：</p><ul><li>初始化部署：在全新部署或者 DataMax 节点重搭的场景下，没有存量的位点信息；在向主库请求流复制时，需要表明自己是 DataMax 节点，同时还需要额外传递 <code>InvalidXLogRecPtr</code> 位点，表明其需要从 Primary 节点当前最旧的位点开始复制； Primary 节点接收到 <code>InvalidXLogRecPtr</code> 的流复制请求之后，会开始从当前最旧且完整的 WAL segment 文件开始发送 WAL 日志，并将相应复制槽的 <code>restart_lsn</code> 设置为该位点；</li><li>异常恢复：从存储上读取元数据文件，确认位点信息；以该位点为起点请求流复制。</li></ul><p><img src="'+k+'" alt="datamax-impl-dir"></p><h3 id="datamax-集群高可用" tabindex="-1"><a class="header-anchor" href="#datamax-集群高可用"><span>DataMax 集群高可用</span></a></h3><p>如下图所示，增加 DataMax 节点后，若 Primary 节点与 Replica 节点同时异常，或存储无法提供服务时，则可将位于不同可用区的 Standby 节点提升为 Primary 节点，保证服务的可用性。在将 Standby 节点提升为 Primary 节点并向外提供服务之前，会确认 Standby 节点是否已从 DataMax 节点拉取完所有日志，待 Standby 节点获取完所有日志后才会将其提升为 Primary 节点。由于 DataMax 节点与 Primary 节点为同步复制，因此该场景下可保证 RPO = 0。</p><p>此外，DataMax 节点在进行日志清理时，除了保留下游 Standby 节点尚未接收的 WAL 日志文件以外，还会保留上游 Primary 节点尚未删除的 WAL 日志文件，避免 Primary 节点异常后，备份系统无法获取到 Primary 节点相较于 DataMax 节点多出的日志信息，保证集群数据的完整性。</p><p><img src="'+x+'" alt="datamax-ha"></p><p>若 DataMax 节点异常，则优先尝试通过重启进行恢复；若重启失败则会对其进行重建。因 DataMax 节点与 Primary 节点的存储彼此隔离，因此两者的数据不会互相影响。此外，DataMax 节点同样可以使用计算存储分离架构，确保 DataMax 节点的异常不会导致其存储的 WAL 日志数据丢失。</p><p><img src="'+g+`" alt="datamax-restart"></p><p>类似地，DataMax 节点实现了如下几种日志同步模式，用户可以根据具体业务需求进行相应配置：</p><ul><li><strong>最大保护模式</strong>：DataMax 节点与 Primary 节点进行同步复制，确保 RPO = 0；若 DataMax 节点因网络或硬件故障无法提供服务，则 Primary 节点也会因此阻塞而无法对外提供服务；</li><li><strong>最大性能模式</strong>：DataMax 节点与 Primary 节点进行异步复制，DataMax 节点不对 Primary 节点性能带来影响，DataMax 节点异常也不会影响 Primary 节点的服务；若 Primary 节点的存储或对应的集群发生故障，可能导致丢失数据，无法确保 RPO = 0；</li><li><strong>最大高可用模式</strong>： <ul><li>当 DataMax 节点正常工作时，DataMax 节点与 Primary 节点进行同步复制，即为最大保护模式；</li><li>若 DataMax 节点异常，Primary 节点自动将同步模式降级为最大性能模式，保证 Primary 节点服务的持续可用性；</li><li>当 DataMax 节点恢复正常后，Primary 节点将最大性能模式提升为最大保护模式，避免 WAL 日志数据丢失的可能性。</li></ul></li></ul><p>综上，通过 DataMax 日志中转节点降低日志同步延迟、分流 Primary 节点的日志传输压力，在性能稳定的情况下，可以保障跨 AZ / 跨域 RPO = 0 的高可用。</p><h2 id="使用指南" tabindex="-1"><a class="header-anchor" href="#使用指南"><span>使用指南</span></a></h2><h3 id="datamax-节点目录初始化" tabindex="-1"><a class="header-anchor" href="#datamax-节点目录初始化"><span>DataMax 节点目录初始化</span></a></h3><p>初始化 DataMax 节点时需要指定 Primary 节点的 system identifier:</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 获取 Primary 节点的 system identifier</span>
~/tmp_basedir_polardb_pg_1100_bld/bin/pg_controldata <span class="token parameter variable">-D</span> ~/primary <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&#39;system identifier&#39;</span>

<span class="token comment"># 创建 DataMax 节点</span>
<span class="token comment"># -i 参数指定的 [primary_system_identifier] 为上一步得到的 Primary 节点 system identifier</span>
~/tmp_basedir_polardb_pg_1100_bld/bin/initdb <span class="token parameter variable">-D</span> datamax <span class="token parameter variable">-i</span> <span class="token punctuation">[</span>primary_system_identifier<span class="token punctuation">]</span>

<span class="token comment"># 如有需要，参考 Primary 节点，对 DataMax 节点的共享存储进行初始化</span>
<span class="token function">sudo</span> pfs <span class="token parameter variable">-C</span> disk <span class="token function">mkdir</span> /nvme0n1/dm_shared_data
<span class="token function">sudo</span> ~/tmp_basedir_polardb_pg_1100_bld/bin/polar-initdb.sh ~/datamax/ /nvme0n1/dm_shared_data/
</code></pre></div><h3 id="加载运维插件" tabindex="-1"><a class="header-anchor" href="#加载运维插件"><span>加载运维插件</span></a></h3><p>以可写节点的形式拉起 DataMax 节点，创建用户和插件以方便后续运维。DataMax 节点默认为只读模式，无法创建用户和插件。</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code>~/tmp_basedir_polardb_pg_1100_bld/bin/pg_ctl start <span class="token parameter variable">-D</span> ~/datamax
</code></pre></div><p>创建管理账号及插件：</p><div class="language-sql" data-ext="sql" data-title="sql"><pre class="language-sql"><code>postgres<span class="token operator">=</span><span class="token comment"># create user test superuser;</span>
<span class="token keyword">CREATE</span> ROLE
postgres<span class="token operator">=</span><span class="token comment"># create extension polar_monitor;</span>
<span class="token keyword">CREATE</span> EXTENSION
</code></pre></div><p>关闭 DataMax 节点：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code>~/tmp_basedir_polardb_pg_1100_bld/bin/pg_ctl stop <span class="token parameter variable">-D</span> ~/datamax<span class="token punctuation">;</span>
</code></pre></div><h3 id="datamax-节点配置及启动" tabindex="-1"><a class="header-anchor" href="#datamax-节点配置及启动"><span>DataMax 节点配置及启动</span></a></h3><p>在 DataMax 节点的 <code>recovery.conf</code> 中添加 <code>polar_datamax_mode</code> 参数，表示当前节点为 DataMax 节点：</p><div class="language-ini" data-ext="ini" data-title="ini"><pre class="language-ini"><code><span class="token key attr-name">polar_datamax_mode</span> <span class="token punctuation">=</span> <span class="token value attr-value">standalone</span>
<span class="token key attr-name">recovery_target_timeline</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">latest</span>&#39;</span>
<span class="token key attr-name">primary_slot_name</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">datamax</span>&#39;</span>
<span class="token key attr-name">primary_conninfo</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">host=[主节点的IP] port=[主节点的端口] user=[$USER] dbname=postgres application_name=datamax</span>&#39;</span>
</code></pre></div><p>启动 DataMax 节点：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code>~/tmp_basedir_polardb_pg_1100_bld/bin/pg_ctl start <span class="token parameter variable">-D</span> ~/datamax
</code></pre></div><h3 id="datamax-节点检查" tabindex="-1"><a class="header-anchor" href="#datamax-节点检查"><span>DataMax 节点检查</span></a></h3><p>DataMax 节点自身可通过 <code>polar_get_datamax_info()</code> 接口来判断其运行是否正常：</p><div class="language-sql" data-ext="sql" data-title="sql"><pre class="language-sql"><code>postgres<span class="token operator">=</span><span class="token comment"># SELECT * FROM polar_get_datamax_info();</span>
 min_received_timeline <span class="token operator">|</span> min_received_lsn <span class="token operator">|</span> last_received_timeline <span class="token operator">|</span> last_received_lsn <span class="token operator">|</span> last_valid_received_lsn <span class="token operator">|</span> clean_reserved_lsn <span class="token operator">|</span> force_clean
<span class="token comment">-----------------------+------------------+------------------------+-------------------+-------------------------+--------------------+-------------</span>
                     <span class="token number">1</span> <span class="token operator">|</span> <span class="token number">0</span><span class="token operator">/</span><span class="token number">40000000</span>       <span class="token operator">|</span>                      <span class="token number">1</span> <span class="token operator">|</span> <span class="token number">0</span><span class="token operator">/</span><span class="token number">4079</span>DFE0        <span class="token operator">|</span> <span class="token number">0</span><span class="token operator">/</span><span class="token number">4079</span>DFE0              <span class="token operator">|</span> <span class="token number">0</span><span class="token operator">/</span><span class="token number">0</span>                <span class="token operator">|</span> f
<span class="token punctuation">(</span><span class="token number">1</span> <span class="token keyword">row</span><span class="token punctuation">)</span>
</code></pre></div><p>在 Primary 节点可以通过 <code>pg_replication_slots</code> 查看对应复制槽的状态：</p><div class="language-sql" data-ext="sql" data-title="sql"><pre class="language-sql"><code>postgres<span class="token operator">=</span><span class="token comment"># SELECT * FROM pg_replication_slots;</span>
 slot_name <span class="token operator">|</span> plugin <span class="token operator">|</span> slot_type <span class="token operator">|</span> datoid <span class="token operator">|</span> <span class="token keyword">database</span> <span class="token operator">|</span> <span class="token keyword">temporary</span> <span class="token operator">|</span> active <span class="token operator">|</span> active_pid <span class="token operator">|</span> xmin <span class="token operator">|</span> catalog_xmin <span class="token operator">|</span> restart_lsn <span class="token operator">|</span> confirmed_flush_lsn
<span class="token comment">-----------+--------+-----------+--------+----------+-----------+--------+------------+------+--------------+-------------+---------------------</span>
 datamax   <span class="token operator">|</span>        <span class="token operator">|</span> physical  <span class="token operator">|</span>        <span class="token operator">|</span>          <span class="token operator">|</span> f         <span class="token operator">|</span> t      <span class="token operator">|</span>     <span class="token number">124551</span> <span class="token operator">|</span>  <span class="token number">570</span> <span class="token operator">|</span>              <span class="token operator">|</span> <span class="token number">0</span><span class="token operator">/</span><span class="token number">4079</span>DFE0  <span class="token operator">|</span>
<span class="token punctuation">(</span><span class="token number">1</span> <span class="token keyword">row</span><span class="token punctuation">)</span>
</code></pre></div><h3 id="日志同步模式配置" tabindex="-1"><a class="header-anchor" href="#日志同步模式配置"><span>日志同步模式配置</span></a></h3><p>通过配置 Primary 节点的 <code>postgresql.conf</code>，可以设置下游 DataMax 节点的日志同步模式：</p><p>最大保护模式。其中 <code>datamax</code> 为 Primary 节点创建的复制槽名称：</p><div class="language-ini" data-ext="ini" data-title="ini"><pre class="language-ini"><code><span class="token key attr-name">polar_enable_transaction_sync_mode</span> <span class="token punctuation">=</span> <span class="token value attr-value">on</span>
<span class="token key attr-name">synchronous_commit</span> <span class="token punctuation">=</span> <span class="token value attr-value">on</span>
<span class="token key attr-name">synchronous_standby_names</span> <span class="token punctuation">=</span> <span class="token value attr-value">&#39;<span class="token inner-value">datamax</span>&#39;</span>
</code></pre></div><p>最大性能模式：</p><div class="language-ini" data-ext="ini" data-title="ini"><pre class="language-ini"><code><span class="token key attr-name">polar_enable_transaction_sync_mode</span> <span class="token punctuation">=</span> <span class="token value attr-value">on</span>
<span class="token key attr-name">synchronous_commit</span> <span class="token punctuation">=</span> <span class="token value attr-value">on</span>
</code></pre></div><p>最大高可用模式：</p><ul><li>参数 <code>polar_sync_replication_timeout</code> 用于设置同步超时时间阈值，单位为毫秒；等待同步复制锁超过此阈值时，同步复制将降级为异步复制；</li><li>参数 <code>polar_sync_rep_timeout_break_lsn_lag</code> 用于设置同步恢复延迟阈值，单位为字节；当异步复制延迟阈值小于此阈值时，异步复制将重新恢复为同步复制。</li></ul><div class="language-ini" data-ext="ini" data-title="ini"><pre class="language-ini"><code><span class="token key attr-name">polar_enable_transaction_sync_mode</span> <span class="token punctuation">=</span> <span class="token value attr-value">on</span>
<span class="token key attr-name">synchronous_commit</span> <span class="token punctuation">=</span> <span class="token value attr-value">on</span>
<span class="token key attr-name">synchronous_standby_names</span> <span class="token punctuation">=</span> <span class="token value attr-value">&#39;<span class="token inner-value">datamax</span>&#39;</span>
<span class="token key attr-name">polar_sync_replication_timeout</span> <span class="token punctuation">=</span> <span class="token value attr-value">10s</span>
<span class="token key attr-name">polar_sync_rep_timeout_break_lsn_lag</span> <span class="token punctuation">=</span> <span class="token value attr-value">8kB</span>
</code></pre></div>`,60);function D(p,M){const o=l("Badge"),r=l("ArticleInfo"),n=l("router-link");return c(),d("div",null,[y,s(o,{type:"tip",text:"V11 / v1.1.6-",vertical:"top"}),s(r,{frontmatter:p.$frontmatter},null,8,["frontmatter"]),a("nav",v,[a("ul",null,[a("li",null,[s(n,{to:"#术语"},{default:t(()=>[e("术语")]),_:1})]),a("li",null,[s(n,{to:"#背景"},{default:t(()=>[e("背景")]),_:1})]),a("li",null,[s(n,{to:"#原理"},{default:t(()=>[e("原理")]),_:1}),a("ul",null,[a("li",null,[s(n,{to:"#datamax-高可用架构"},{default:t(()=>[e("DataMax 高可用架构")]),_:1})]),a("li",null,[s(n,{to:"#datamax-实现"},{default:t(()=>[e("DataMax 实现")]),_:1})]),a("li",null,[s(n,{to:"#datamax-集群高可用"},{default:t(()=>[e("DataMax 集群高可用")]),_:1})])])]),a("li",null,[s(n,{to:"#使用指南"},{default:t(()=>[e("使用指南")]),_:1}),a("ul",null,[a("li",null,[s(n,{to:"#datamax-节点目录初始化"},{default:t(()=>[e("DataMax 节点目录初始化")]),_:1})]),a("li",null,[s(n,{to:"#加载运维插件"},{default:t(()=>[e("加载运维插件")]),_:1})]),a("li",null,[s(n,{to:"#datamax-节点配置及启动"},{default:t(()=>[e("DataMax 节点配置及启动")]),_:1})]),a("li",null,[s(n,{to:"#datamax-节点检查"},{default:t(()=>[e("DataMax 节点检查")]),_:1})]),a("li",null,[s(n,{to:"#日志同步模式配置"},{default:t(()=>[e("日志同步模式配置")]),_:1})])])])])]),b])}const f=i(h,[["render",D],["__file","datamax.html.vue"]]),A=JSON.parse('{"path":"/zh/features/v11/availability/datamax.html","title":"DataMax 日志节点","lang":"zh-CN","frontmatter":{"author":"玊于","date":"2022/11/17","minute":30},"headers":[{"level":2,"title":"术语","slug":"术语","link":"#术语","children":[]},{"level":2,"title":"背景","slug":"背景","link":"#背景","children":[]},{"level":2,"title":"原理","slug":"原理","link":"#原理","children":[{"level":3,"title":"DataMax 高可用架构","slug":"datamax-高可用架构","link":"#datamax-高可用架构","children":[]},{"level":3,"title":"DataMax 实现","slug":"datamax-实现","link":"#datamax-实现","children":[]},{"level":3,"title":"DataMax 集群高可用","slug":"datamax-集群高可用","link":"#datamax-集群高可用","children":[]}]},{"level":2,"title":"使用指南","slug":"使用指南","link":"#使用指南","children":[{"level":3,"title":"DataMax 节点目录初始化","slug":"datamax-节点目录初始化","link":"#datamax-节点目录初始化","children":[]},{"level":3,"title":"加载运维插件","slug":"加载运维插件","link":"#加载运维插件","children":[]},{"level":3,"title":"DataMax 节点配置及启动","slug":"datamax-节点配置及启动","link":"#datamax-节点配置及启动","children":[]},{"level":3,"title":"DataMax 节点检查","slug":"datamax-节点检查","link":"#datamax-节点检查","children":[]},{"level":3,"title":"日志同步模式配置","slug":"日志同步模式配置","link":"#日志同步模式配置","children":[]}]}],"git":{"updatedTime":1725527283000},"filePathRelative":"zh/features/v11/availability/datamax.md"}');export{f as comp,A as data};
