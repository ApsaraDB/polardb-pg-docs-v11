import{_ as u,r as l,o as d,c as k,d as s,a,w as e,e as c,b as n}from"./app-4enb6FVN.js";const b={},v=a("h1",{id:"计算节点扩缩容",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#计算节点扩缩容"},[a("span",null,"计算节点扩缩容")])],-1),m=a("p",null,"PolarDB for PostgreSQL 是一款存储与计算分离的数据库，所有计算节点共享存储，并可以按需要弹性增加或删减计算节点而无需做任何数据迁移。所有本教程将协助您在共享存储集群上添加或删除计算节点。",-1),_={class:"table-of-contents"},h=a("h2",{id:"部署读写节点",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#部署读写节点"},[a("span",null,"部署读写节点")])],-1),g=a("p",null,"首先，在已经搭建完毕的共享存储集群上，初始化并启动第一个计算节点，即读写节点，该节点可以对共享存储进行读写。我们在下面的镜像中提供了已经编译完毕的 PolarDB-PG 数据库和工具的可执行文件：",-1),f=a("div",{class:"language-bash","data-ext":"sh","data-title":"sh"},[a("pre",{class:"language-bash"},[a("code",null,[a("span",{class:"token function"},"docker"),n(` pull polardb/polardb_pg_binary:11
`),a("span",{class:"token function"},"docker"),n(" run "),a("span",{class:"token parameter variable"},"-it"),n(),a("span",{class:"token punctuation"},"\\"),n(`
    --cap-add`),a("span",{class:"token operator"},"="),n("SYS_PTRACE "),a("span",{class:"token punctuation"},"\\"),n(`
    `),a("span",{class:"token parameter variable"},"--privileged"),a("span",{class:"token operator"},"="),n("true "),a("span",{class:"token punctuation"},"\\"),n(`
    `),a("span",{class:"token parameter variable"},"--name"),n(" polardb_pg "),a("span",{class:"token punctuation"},"\\"),n(`
    --shm-size`),a("span",{class:"token operator"},"="),n("512m "),a("span",{class:"token punctuation"},"\\"),n(`
    polardb/polardb_pg_binary:11 `),a("span",{class:"token punctuation"},"\\"),n(`
    `),a("span",{class:"token function"},"bash"),n(`
`)])])],-1),y=a("div",{class:"language-bash","data-ext":"sh","data-title":"sh"},[a("pre",{class:"language-bash"},[a("code",null,[a("span",{class:"token function"},"docker"),n(` pull registry.cn-hangzhou.aliyuncs.com/polardb_pg/polardb_pg_binary:11
`),a("span",{class:"token function"},"docker"),n(" run "),a("span",{class:"token parameter variable"},"-it"),n(),a("span",{class:"token punctuation"},"\\"),n(`
    --cap-add`),a("span",{class:"token operator"},"="),n("SYS_PTRACE "),a("span",{class:"token punctuation"},"\\"),n(`
    `),a("span",{class:"token parameter variable"},"--privileged"),a("span",{class:"token operator"},"="),n("true "),a("span",{class:"token punctuation"},"\\"),n(`
    `),a("span",{class:"token parameter variable"},"--name"),n(" polardb_pg "),a("span",{class:"token punctuation"},"\\"),n(`
    --shm-size`),a("span",{class:"token operator"},"="),n("512m "),a("span",{class:"token punctuation"},"\\"),n(`
    registry.cn-hangzhou.aliyuncs.com/polardb_pg/polardb_pg_binary:11 `),a("span",{class:"token punctuation"},"\\"),n(`
    `),a("span",{class:"token function"},"bash"),n(`
`)])])],-1),x=c(`<div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">ls</span> ~/tmp_basedir_polardb_pg_1100_bld/bin/
clusterdb     dropuser           pg_basebackup   pg_dump         pg_resetwal    pg_test_timing       polar-initdb.sh          psql
createdb      ecpg               pgbench         pg_dumpall      pg_restore     pg_upgrade           polar-replica-initdb.sh  reindexdb
createuser    initdb             pg_config       pg_isready      pg_rewind      pg_verify_checksums  polar_tools              vacuumdb
dbatools.sql  oid2name           pg_controldata  pg_receivewal   pg_standby     pg_waldump           postgres                 vacuumlo
dropdb        pg_archivecleanup  pg_ctl          pg_recvlogical  pg_test_fsync  polar_basebackup     postmaster
</code></pre></div><h3 id="确认存储可访问" tabindex="-1"><a class="header-anchor" href="#确认存储可访问"><span>确认存储可访问</span></a></h3><p>使用 <code>lsblk</code> 命令确认存储集群已经能够被当前机器访问到。比如，如下示例中的 <code>nvme1n1</code> 是将要使用的共享存储的块设备：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ lsblk
NAME        MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
nvme0n1     <span class="token number">259</span>:0    <span class="token number">0</span>   40G  <span class="token number">0</span> disk
└─nvme0n1p1 <span class="token number">259</span>:1    <span class="token number">0</span>   40G  <span class="token number">0</span> part /etc/hosts
nvme1n1     <span class="token number">259</span>:2    <span class="token number">0</span>  100G  <span class="token number">0</span> disk
</code></pre></div><h3 id="格式化并挂载-pfs-文件系统" tabindex="-1"><a class="header-anchor" href="#格式化并挂载-pfs-文件系统"><span>格式化并挂载 PFS 文件系统</span></a></h3><p>此时，共享存储上没有任何内容。使用容器内的 PFS 工具将共享存储格式化为 PFS 文件系统的格式：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">sudo</span> pfs <span class="token parameter variable">-C</span> disk <span class="token function">mkfs</span> nvme1n1
</code></pre></div><p>格式化完成后，在当前容器内启动 PFS 守护进程，挂载到文件系统上。该守护进程后续将会被计算节点用于访问共享存储：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">sudo</span> /usr/local/polarstore/pfsd/bin/start_pfsd.sh <span class="token parameter variable">-p</span> nvme1n1 <span class="token parameter variable">-w</span> <span class="token number">2</span>
</code></pre></div><h3 id="初始化数据目录" tabindex="-1"><a class="header-anchor" href="#初始化数据目录"><span>初始化数据目录</span></a></h3><p>使用 <code>initdb</code> 在节点本地存储的 <code>~/primary</code> 路径上创建本地数据目录。本地数据目录中将会存放节点的配置、审计日志等节点私有的信息：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token environment constant">$HOME</span>/tmp_basedir_polardb_pg_1100_bld/bin/initdb <span class="token parameter variable">-D</span> <span class="token environment constant">$HOME</span>/primary
</code></pre></div><p>使用 PFS 工具，在共享存储上创建一个共享数据目录；使用 <code>polar-initdb.sh</code> 脚本把将会被所有节点共享的数据文件拷贝到共享存储的数据目录中。将会被所有节点共享的文件包含所有的表文件、WAL 日志文件等：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">sudo</span> pfs <span class="token parameter variable">-C</span> disk <span class="token function">mkdir</span> /nvme1n1/shared_data

<span class="token function">sudo</span> <span class="token environment constant">$HOME</span>/tmp_basedir_polardb_pg_1100_bld/bin/polar-initdb.sh <span class="token punctuation">\\</span>
    <span class="token environment constant">$HOME</span>/primary/ /nvme1n1/shared_data/
</code></pre></div><h3 id="编辑读写节点配置" tabindex="-1"><a class="header-anchor" href="#编辑读写节点配置"><span>编辑读写节点配置</span></a></h3><p>对读写节点的配置文件 <code>~/primary/postgresql.conf</code> 进行修改，使数据库以共享模式启动，并能够找到共享存储上的数据目录：</p><div class="language-ini line-numbers-mode" data-ext="ini" data-title="ini"><pre class="language-ini"><code><span class="token key attr-name">port</span><span class="token punctuation">=</span><span class="token value attr-value">5432</span>
<span class="token key attr-name">polar_hostid</span><span class="token punctuation">=</span><span class="token value attr-value">1</span>

<span class="token key attr-name">polar_enable_shared_storage_mode</span><span class="token punctuation">=</span><span class="token value attr-value">on</span>
<span class="token key attr-name">polar_disk_name</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">nvme1n1</span>&#39;</span>
<span class="token key attr-name">polar_datadir</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">/nvme1n1/shared_data/</span>&#39;</span>
<span class="token key attr-name">polar_vfs.localfs_mode</span><span class="token punctuation">=</span><span class="token value attr-value">off</span>
<span class="token key attr-name">shared_preload_libraries</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">$libdir/polar_vfs,$libdir/polar_worker</span>&#39;</span>
<span class="token key attr-name">polar_storage_cluster_name</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">disk</span>&#39;</span>

<span class="token key attr-name">logging_collector</span><span class="token punctuation">=</span><span class="token value attr-value">on</span>
<span class="token key attr-name">log_line_prefix</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">%p\\t%r\\t%u\\t%m\\t</span>&#39;</span>
<span class="token key attr-name">log_directory</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">pg_log</span>&#39;</span>
<span class="token key attr-name">listen_addresses</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">*</span>&#39;</span>
<span class="token key attr-name">max_connections</span><span class="token punctuation">=</span><span class="token value attr-value">1000</span>
<span class="token key attr-name">synchronous_standby_names</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">replica1</span>&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编辑读写节点的客户端认证文件 <code>~/primary/pg_hba.conf</code>，允许来自所有地址的客户端以 <code>postgres</code> 用户进行物理复制：</p><div class="language-text" data-ext="text" data-title="text"><pre class="language-text"><code>host	replication	postgres	0.0.0.0/0	trust
</code></pre></div><h3 id="启动读写节点" tabindex="-1"><a class="header-anchor" href="#启动读写节点"><span>启动读写节点</span></a></h3><p>使用以下命令启动读写节点，并检查节点能否正常运行：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token environment constant">$HOME</span>/tmp_basedir_polardb_pg_1100_bld/bin/pg_ctl <span class="token parameter variable">-D</span> <span class="token environment constant">$HOME</span>/primary start

<span class="token environment constant">$HOME</span>/tmp_basedir_polardb_pg_1100_bld/bin/psql <span class="token punctuation">\\</span>
    <span class="token parameter variable">-p</span> <span class="token number">5432</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">-d</span> postgres <span class="token punctuation">\\</span>
    <span class="token parameter variable">-c</span> <span class="token string">&#39;SELECT version();&#39;</span>
            version
--------------------------------
 PostgreSQL <span class="token number">11.9</span> <span class="token punctuation">(</span>POLARDB <span class="token number">11.9</span><span class="token punctuation">)</span>
<span class="token punctuation">(</span><span class="token number">1</span> row<span class="token punctuation">)</span>
</code></pre></div><h2 id="集群扩容" tabindex="-1"><a class="header-anchor" href="#集群扩容"><span>集群扩容</span></a></h2><p>接下来，在已经有一个读写节点的计算集群中扩容一个新的计算节点。由于 PolarDB for PostgreSQL 是一写多读的架构，所以后续扩容的节点只可以对共享存储进行读取，但无法对共享存储进行写入。只读节点通过与读写节点进行物理复制来保持内存状态的同步。</p><p>类似地，在用于部署新计算节点的机器上，拉取镜像并启动带有可执行文件的容器：</p>`,25),E=a("div",{class:"language-bash","data-ext":"sh","data-title":"sh"},[a("pre",{class:"language-bash"},[a("code",null,[a("span",{class:"token function"},"docker"),n(` pull polardb/polardb_pg_binary:11
`),a("span",{class:"token function"},"docker"),n(" run "),a("span",{class:"token parameter variable"},"-it"),n(),a("span",{class:"token punctuation"},"\\"),n(`
    --cap-add`),a("span",{class:"token operator"},"="),n("SYS_PTRACE "),a("span",{class:"token punctuation"},"\\"),n(`
    `),a("span",{class:"token parameter variable"},"--privileged"),a("span",{class:"token operator"},"="),n("true "),a("span",{class:"token punctuation"},"\\"),n(`
    `),a("span",{class:"token parameter variable"},"--name"),n(" polardb_pg "),a("span",{class:"token punctuation"},"\\"),n(`
    --shm-size`),a("span",{class:"token operator"},"="),n("512m "),a("span",{class:"token punctuation"},"\\"),n(`
    polardb/polardb_pg_binary:11 `),a("span",{class:"token punctuation"},"\\"),n(`
    `),a("span",{class:"token function"},"bash"),n(`
`)])])],-1),S=a("div",{class:"language-bash","data-ext":"sh","data-title":"sh"},[a("pre",{class:"language-bash"},[a("code",null,[a("span",{class:"token function"},"docker"),n(` pull registry.cn-hangzhou.aliyuncs.com/polardb_pg/polardb_pg_binary:11
`),a("span",{class:"token function"},"docker"),n(" run "),a("span",{class:"token parameter variable"},"-it"),n(),a("span",{class:"token punctuation"},"\\"),n(`
    --cap-add`),a("span",{class:"token operator"},"="),n("SYS_PTRACE "),a("span",{class:"token punctuation"},"\\"),n(`
    `),a("span",{class:"token parameter variable"},"--privileged"),a("span",{class:"token operator"},"="),n("true "),a("span",{class:"token punctuation"},"\\"),n(`
    `),a("span",{class:"token parameter variable"},"--name"),n(" polardb_pg "),a("span",{class:"token punctuation"},"\\"),n(`
    --shm-size`),a("span",{class:"token operator"},"="),n("512m "),a("span",{class:"token punctuation"},"\\"),n(`
    registry.cn-hangzhou.aliyuncs.com/polardb_pg/polardb_pg_binary:11 `),a("span",{class:"token punctuation"},"\\"),n(`
    `),a("span",{class:"token function"},"bash"),n(`
`)])])],-1),O=c(`<h3 id="确认存储可访问-1" tabindex="-1"><a class="header-anchor" href="#确认存储可访问-1"><span>确认存储可访问</span></a></h3><p>确保部署只读节点的机器也可以访问到共享存储的块设备：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ lsblk
NAME        MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
nvme0n1     <span class="token number">259</span>:0    <span class="token number">0</span>   40G  <span class="token number">0</span> disk
└─nvme0n1p1 <span class="token number">259</span>:1    <span class="token number">0</span>   40G  <span class="token number">0</span> part /etc/hosts
nvme1n1     <span class="token number">259</span>:2    <span class="token number">0</span>  100G  <span class="token number">0</span> disk
</code></pre></div><h3 id="挂载-pfs-文件系统" tabindex="-1"><a class="header-anchor" href="#挂载-pfs-文件系统"><span>挂载 PFS 文件系统</span></a></h3><p>由于此时共享存储已经被读写节点格式化为 PFS 格式了，因此这里无需再次进行格式化。只需要启动 PFS 守护进程完成挂载即可：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">sudo</span> /usr/local/polarstore/pfsd/bin/start_pfsd.sh <span class="token parameter variable">-p</span> nvme1n1 <span class="token parameter variable">-w</span> <span class="token number">2</span>
</code></pre></div><h3 id="初始化数据目录-1" tabindex="-1"><a class="header-anchor" href="#初始化数据目录-1"><span>初始化数据目录</span></a></h3><p>在只读节点本地磁盘的 <code>~/replica1</code> 路径上创建一个空目录，然后通过 <code>polar-replica-initdb.sh</code> 脚本使用共享存储上的数据目录来初始化只读节点的本地目录。初始化后的本地目录中没有默认配置文件，所以还需要使用 <code>initdb</code> 创建一个临时的本地目录模板，然后将所有的默认配置文件拷贝到只读节点的本地目录下：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-m</span> 0700 <span class="token environment constant">$HOME</span>/replica1
<span class="token function">sudo</span> ~/tmp_basedir_polardb_pg_1100_bld/bin/polar-replica-initdb.sh <span class="token punctuation">\\</span>
    /nvme1n1/shared_data/ <span class="token environment constant">$HOME</span>/replica1/

<span class="token environment constant">$HOME</span>/tmp_basedir_polardb_pg_1100_bld/bin/initdb <span class="token parameter variable">-D</span> /tmp/replica1
<span class="token function">cp</span> /tmp/replica1/*.conf <span class="token environment constant">$HOME</span>/replica1/
</code></pre></div><h3 id="编辑只读节点配置" tabindex="-1"><a class="header-anchor" href="#编辑只读节点配置"><span>编辑只读节点配置</span></a></h3><p>编辑只读节点的配置文件 <code>~/replica1/postgresql.conf</code>，配置好只读节点的集群标识和监听端口，以及与读写节点相同的共享存储目录：</p><div class="language-ini line-numbers-mode" data-ext="ini" data-title="ini"><pre class="language-ini"><code><span class="token key attr-name">port</span><span class="token punctuation">=</span><span class="token value attr-value">5432</span>
<span class="token key attr-name">polar_hostid</span><span class="token punctuation">=</span><span class="token value attr-value">2</span>

<span class="token key attr-name">polar_enable_shared_storage_mode</span><span class="token punctuation">=</span><span class="token value attr-value">on</span>
<span class="token key attr-name">polar_disk_name</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">nvme1n1</span>&#39;</span>
<span class="token key attr-name">polar_datadir</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">/nvme1n1/shared_data/</span>&#39;</span>
<span class="token key attr-name">polar_vfs.localfs_mode</span><span class="token punctuation">=</span><span class="token value attr-value">off</span>
<span class="token key attr-name">shared_preload_libraries</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">$libdir/polar_vfs,$libdir/polar_worker</span>&#39;</span>
<span class="token key attr-name">polar_storage_cluster_name</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">disk</span>&#39;</span>

<span class="token key attr-name">logging_collector</span><span class="token punctuation">=</span><span class="token value attr-value">on</span>
<span class="token key attr-name">log_line_prefix</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">%p\\t%r\\t%u\\t%m\\t</span>&#39;</span>
<span class="token key attr-name">log_directory</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">pg_log</span>&#39;</span>
<span class="token key attr-name">listen_addresses</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">*</span>&#39;</span>
<span class="token key attr-name">max_connections</span><span class="token punctuation">=</span><span class="token value attr-value">1000</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编辑只读节点的复制配置文件 <code>~/replica1/recovery.conf</code>，配置好当前节点的角色（只读），以及从读写节点进行物理复制的连接串和复制槽：</p><div class="language-ini" data-ext="ini" data-title="ini"><pre class="language-ini"><code><span class="token key attr-name">polar_replica</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">on</span>&#39;</span>
<span class="token key attr-name">recovery_target_timeline</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">latest</span>&#39;</span>
<span class="token key attr-name">primary_conninfo</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">host=[读写节点所在IP] port=5432 user=postgres dbname=postgres application_name=replica1</span>&#39;</span>
<span class="token key attr-name">primary_slot_name</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">replica1</span>&#39;</span>
</code></pre></div><p>由于读写节点上暂时还没有名为 <code>replica1</code> 的复制槽，所以需要连接到读写节点上，创建这个复制槽：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token environment constant">$HOME</span>/tmp_basedir_polardb_pg_1100_bld/bin/psql <span class="token punctuation">\\</span>
    <span class="token parameter variable">-p</span> <span class="token number">5432</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">-d</span> postgres <span class="token punctuation">\\</span>
    <span class="token parameter variable">-c</span> <span class="token string">&quot;SELECT pg_create_physical_replication_slot(&#39;replica1&#39;);&quot;</span>
 pg_create_physical_replication_slot
-------------------------------------
 <span class="token punctuation">(</span>replica1,<span class="token punctuation">)</span>
<span class="token punctuation">(</span><span class="token number">1</span> row<span class="token punctuation">)</span>
</code></pre></div><h3 id="启动只读节点" tabindex="-1"><a class="header-anchor" href="#启动只读节点"><span>启动只读节点</span></a></h3><p>完成上述步骤后，启动只读节点并验证：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token environment constant">$HOME</span>/tmp_basedir_polardb_pg_1100_bld/bin/pg_ctl <span class="token parameter variable">-D</span> <span class="token environment constant">$HOME</span>/replica1 start

<span class="token environment constant">$HOME</span>/tmp_basedir_polardb_pg_1100_bld/bin/psql <span class="token punctuation">\\</span>
    <span class="token parameter variable">-p</span> <span class="token number">5432</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">-d</span> postgres <span class="token punctuation">\\</span>
    <span class="token parameter variable">-c</span> <span class="token string">&#39;SELECT version();&#39;</span>
            version
--------------------------------
 PostgreSQL <span class="token number">11.9</span> <span class="token punctuation">(</span>POLARDB <span class="token number">11.9</span><span class="token punctuation">)</span>
<span class="token punctuation">(</span><span class="token number">1</span> row<span class="token punctuation">)</span>
</code></pre></div><h3 id="集群功能检查" tabindex="-1"><a class="header-anchor" href="#集群功能检查"><span>集群功能检查</span></a></h3><p>连接到读写节点上，创建一个表并插入数据：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token environment constant">$HOME</span>/tmp_basedir_polardb_pg_1100_bld/bin/psql <span class="token parameter variable">-q</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">-p</span> <span class="token number">5432</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">-d</span> postgres <span class="token punctuation">\\</span>
    <span class="token parameter variable">-c</span> <span class="token string">&quot;CREATE TABLE t(id INT); INSERT INTO t SELECT generate_series(1,10);&quot;</span>
</code></pre></div><p>在只读节点上可以立刻查询到从读写节点上插入的数据：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token environment constant">$HOME</span>/tmp_basedir_polardb_pg_1100_bld/bin/psql <span class="token parameter variable">-q</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">-p</span> <span class="token number">5432</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">-d</span> postgres <span class="token punctuation">\\</span>
    <span class="token parameter variable">-c</span> <span class="token string">&quot;SELECT * FROM t;&quot;</span>
 <span class="token function">id</span>
----
  <span class="token number">1</span>
  <span class="token number">2</span>
  <span class="token number">3</span>
  <span class="token number">4</span>
  <span class="token number">5</span>
  <span class="token number">6</span>
  <span class="token number">7</span>
  <span class="token number">8</span>
  <span class="token number">9</span>
 <span class="token number">10</span>
<span class="token punctuation">(</span><span class="token number">10</span> rows<span class="token punctuation">)</span>
</code></pre></div><p>从读写节点上可以看到用于与只读节点进行物理复制的复制槽已经处于活跃状态：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token environment constant">$HOME</span>/tmp_basedir_polardb_pg_1100_bld/bin/psql <span class="token parameter variable">-q</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">-p</span> <span class="token number">5432</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">-d</span> postgres <span class="token punctuation">\\</span>
    <span class="token parameter variable">-c</span> <span class="token string">&quot;SELECT * FROM pg_replication_slots;&quot;</span>
 slot_name <span class="token operator">|</span> plugin <span class="token operator">|</span> slot_type <span class="token operator">|</span> datoid <span class="token operator">|</span> database <span class="token operator">|</span> temporary <span class="token operator">|</span> active <span class="token operator">|</span> active_pid <span class="token operator">|</span> xmin <span class="token operator">|</span> catalog_xmin <span class="token operator">|</span> restart_lsn <span class="token operator">|</span> confirmed_flush_lsn
-----------+--------+-----------+--------+----------+-----------+--------+------------+------+--------------+-------------+---------------------
 replica1  <span class="token operator">|</span>        <span class="token operator">|</span> physical  <span class="token operator">|</span>        <span class="token operator">|</span>          <span class="token operator">|</span> f         <span class="token operator">|</span> t      <span class="token operator">|</span>         <span class="token number">45</span> <span class="token operator">|</span>      <span class="token operator">|</span>              <span class="token operator">|</span> <span class="token number">0</span>/4079E8E8  <span class="token operator">|</span>
<span class="token punctuation">(</span><span class="token number">1</span> rows<span class="token punctuation">)</span>
</code></pre></div><p>依次类推，使用类似的方法还可以横向扩容更多的只读节点。</p><h2 id="集群缩容" tabindex="-1"><a class="header-anchor" href="#集群缩容"><span>集群缩容</span></a></h2><p>集群缩容的步骤较为简单：将只读节点停机即可。</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token environment constant">$HOME</span>/tmp_basedir_polardb_pg_1100_bld/bin/pg_ctl <span class="token parameter variable">-D</span> <span class="token environment constant">$HOME</span>/replica1 stop
</code></pre></div><p>在只读节点停机后，读写节点上的复制槽将变为非活跃状态。非活跃的复制槽将会阻止 WAL 日志的回收，所以需要及时清理。</p><p>在读写节点上执行如下命令，移除名为 <code>replica1</code> 的复制槽：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token environment constant">$HOME</span>/tmp_basedir_polardb_pg_1100_bld/bin/psql <span class="token punctuation">\\</span>
    <span class="token parameter variable">-p</span> <span class="token number">5432</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">-d</span> postgres <span class="token punctuation">\\</span>
    <span class="token parameter variable">-c</span> <span class="token string">&quot;SELECT pg_drop_replication_slot(&#39;replica1&#39;);&quot;</span>
 pg_drop_replication_slot
--------------------------

<span class="token punctuation">(</span><span class="token number">1</span> row<span class="token punctuation">)</span>
</code></pre></div>`,33);function M(r,P){const i=l("ArticleInfo"),t=l("router-link"),p=l("CodeGroupItem"),o=l("CodeGroup");return d(),k("div",null,[v,s(i,{frontmatter:r.$frontmatter},null,8,["frontmatter"]),m,a("nav",_,[a("ul",null,[a("li",null,[s(t,{to:"#部署读写节点"},{default:e(()=>[n("部署读写节点")]),_:1}),a("ul",null,[a("li",null,[s(t,{to:"#确认存储可访问"},{default:e(()=>[n("确认存储可访问")]),_:1})]),a("li",null,[s(t,{to:"#格式化并挂载-pfs-文件系统"},{default:e(()=>[n("格式化并挂载 PFS 文件系统")]),_:1})]),a("li",null,[s(t,{to:"#初始化数据目录"},{default:e(()=>[n("初始化数据目录")]),_:1})]),a("li",null,[s(t,{to:"#编辑读写节点配置"},{default:e(()=>[n("编辑读写节点配置")]),_:1})]),a("li",null,[s(t,{to:"#启动读写节点"},{default:e(()=>[n("启动读写节点")]),_:1})])])]),a("li",null,[s(t,{to:"#集群扩容"},{default:e(()=>[n("集群扩容")]),_:1}),a("ul",null,[a("li",null,[s(t,{to:"#确认存储可访问-1"},{default:e(()=>[n("确认存储可访问")]),_:1})]),a("li",null,[s(t,{to:"#挂载-pfs-文件系统"},{default:e(()=>[n("挂载 PFS 文件系统")]),_:1})]),a("li",null,[s(t,{to:"#初始化数据目录-1"},{default:e(()=>[n("初始化数据目录")]),_:1})]),a("li",null,[s(t,{to:"#编辑只读节点配置"},{default:e(()=>[n("编辑只读节点配置")]),_:1})]),a("li",null,[s(t,{to:"#启动只读节点"},{default:e(()=>[n("启动只读节点")]),_:1})]),a("li",null,[s(t,{to:"#集群功能检查"},{default:e(()=>[n("集群功能检查")]),_:1})])])]),a("li",null,[s(t,{to:"#集群缩容"},{default:e(()=>[n("集群缩容")]),_:1})])])]),h,g,s(o,null,{default:e(()=>[s(p,{title:"DockerHub"},{default:e(()=>[f]),_:1}),s(p,{title:"阿里云 ACR"},{default:e(()=>[y]),_:1})]),_:1}),x,s(o,null,{default:e(()=>[s(p,{title:"DockerHub"},{default:e(()=>[E]),_:1}),s(p,{title:"阿里云 ACR"},{default:e(()=>[S]),_:1})]),_:1}),O])}const q=u(b,[["render",M],["__file","scale-out.html.vue"]]),T=JSON.parse('{"path":"/zh/operation/scale-out.html","title":"计算节点扩缩容","lang":"zh-CN","frontmatter":{"author":"棠羽","date":"2022/12/19","minute":30},"headers":[{"level":2,"title":"部署读写节点","slug":"部署读写节点","link":"#部署读写节点","children":[{"level":3,"title":"确认存储可访问","slug":"确认存储可访问","link":"#确认存储可访问","children":[]},{"level":3,"title":"格式化并挂载 PFS 文件系统","slug":"格式化并挂载-pfs-文件系统","link":"#格式化并挂载-pfs-文件系统","children":[]},{"level":3,"title":"初始化数据目录","slug":"初始化数据目录","link":"#初始化数据目录","children":[]},{"level":3,"title":"编辑读写节点配置","slug":"编辑读写节点配置","link":"#编辑读写节点配置","children":[]},{"level":3,"title":"启动读写节点","slug":"启动读写节点","link":"#启动读写节点","children":[]}]},{"level":2,"title":"集群扩容","slug":"集群扩容","link":"#集群扩容","children":[{"level":3,"title":"确认存储可访问","slug":"确认存储可访问-1","link":"#确认存储可访问-1","children":[]},{"level":3,"title":"挂载 PFS 文件系统","slug":"挂载-pfs-文件系统","link":"#挂载-pfs-文件系统","children":[]},{"level":3,"title":"初始化数据目录","slug":"初始化数据目录-1","link":"#初始化数据目录-1","children":[]},{"level":3,"title":"编辑只读节点配置","slug":"编辑只读节点配置","link":"#编辑只读节点配置","children":[]},{"level":3,"title":"启动只读节点","slug":"启动只读节点","link":"#启动只读节点","children":[]},{"level":3,"title":"集群功能检查","slug":"集群功能检查","link":"#集群功能检查","children":[]}]},{"level":2,"title":"集群缩容","slug":"集群缩容","link":"#集群缩容","children":[]}],"git":{"updatedTime":1725527283000},"filePathRelative":"zh/operation/scale-out.md"}');export{q as comp,T as data};
