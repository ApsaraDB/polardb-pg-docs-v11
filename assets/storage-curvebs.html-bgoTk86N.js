import{_ as i,r as t,o as u,c as r,a as s,b as n,d as a,w as d,e as k}from"./app-4enb6FVN.js";const v="/polardb-pg-docs-v11/assets/curve-cluster-BJx5WECB.png",m={},b={id:"curvebs-共享存储",tabindex:"-1"},h={class:"header-anchor",href:"#curvebs-共享存储"},g={href:"https://developer.aliyun.com/live/250218"},y={href:"https://github.com/opencurve/curve",target:"_blank",rel:"noopener noreferrer"},f=s("ul",null,[s("li",null,"对接 OpenStack 平台为云主机提供高性能块存储服务；"),s("li",null,"对接 Kubernetes 为其提供 RWO、RWX 等类型的持久化存储卷；"),s("li",null,"对接 PolarFS 作为云原生数据库的高性能存储底座，完美支持云原生数据库的存算分离架构。")],-1),_=s("p",null,"Curve 亦可作为云存储中间件使用 S3 兼容的对象存储作为数据存储引擎，为公有云用户提供高性价比的共享文件存储。",-1),S={href:"https://github.com/opencurve/curveadm/wiki",target:"_blank",rel:"noopener noreferrer"},x=s("h2",{id:"设备准备",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#设备准备"},[s("span",null,"设备准备")])],-1),C=s("p",null,[s("img",{src:v,alt:"curve-cluster"})],-1),$=s("p",null,"如图所示，本示例共使用六台服务器。其中，一台中控服务器和三台存储服务器共同组成 CurveBS 集群，对外暴露为一个共享存储服务。剩余两台服务器分别用于部署 PolarDB for PostgreSQL 数据库的读写节点和只读节点，它们共享 CurveBS 对外暴露的块存储设备。",-1),B={href:"https://openanolis.cn/anolisos",target:"_blank",rel:"noopener noreferrer"},P={href:"https://www.docker.com/",target:"_blank",rel:"noopener noreferrer"},O=s("li",null,"在 Curve 中控机上配置 SSH 免密登陆到其它五台服务器",-1),K=k(`<h2 id="在中控机上安装-curveadm" tabindex="-1"><a class="header-anchor" href="#在中控机上安装-curveadm"><span>在中控机上安装 CurveAdm</span></a></h2><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">bash</span> <span class="token parameter variable">-c</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> <span class="token parameter variable">-fsSL</span> https://curveadm.nos-eastchina1.126.net/script/install.sh<span class="token variable">)</span></span>&quot;</span>
<span class="token builtin class-name">source</span> /root/.bash_profile
</code></pre></div><h2 id="导入主机列表" tabindex="-1"><a class="header-anchor" href="#导入主机列表"><span>导入主机列表</span></a></h2><p>在中控机上编辑主机列表文件：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">vim</span> hosts.yaml
</code></pre></div><p>文件中包含另外五台服务器的 IP 地址和在 Curve 集群内的名称，其中：</p><ul><li>三台主机为 Curve 存储节点主机</li><li>两台主机为 PolarDB for PostgreSQL 计算节点主机</li></ul><div class="language-yaml line-numbers-mode" data-ext="yml" data-title="yml"><pre class="language-yaml"><code><span class="token key atrule">global</span><span class="token punctuation">:</span>
  <span class="token key atrule">user</span><span class="token punctuation">:</span> root
  <span class="token key atrule">ssh_port</span><span class="token punctuation">:</span> <span class="token number">22</span>
  <span class="token key atrule">private_key_file</span><span class="token punctuation">:</span> /root/.ssh/id_rsa

<span class="token key atrule">hosts</span><span class="token punctuation">:</span>
  <span class="token comment"># Curve worker nodes</span>
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> server<span class="token punctuation">-</span>host1
    <span class="token key atrule">hostname</span><span class="token punctuation">:</span> 172.16.0.223
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> server<span class="token punctuation">-</span>host2
    <span class="token key atrule">hostname</span><span class="token punctuation">:</span> 172.16.0.224
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> server<span class="token punctuation">-</span>host3
    <span class="token key atrule">hostname</span><span class="token punctuation">:</span> 172.16.0.225
  <span class="token comment"># PolarDB nodes</span>
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> polardb<span class="token punctuation">-</span>primary
    <span class="token key atrule">hostname</span><span class="token punctuation">:</span> 172.16.0.226
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> polardb<span class="token punctuation">-</span>replica
    <span class="token key atrule">hostname</span><span class="token punctuation">:</span> 172.16.0.227
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>导入主机列表：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code>curveadm hosts commit hosts.yaml
</code></pre></div><h2 id="格式化磁盘" tabindex="-1"><a class="header-anchor" href="#格式化磁盘"><span>格式化磁盘</span></a></h2><p>准备磁盘列表，并提前生成一批固定大小并预写过的 chunk 文件。磁盘列表中需要包含：</p><ul><li>将要进行格式化的所有存储节点主机</li><li>每台主机上的统一块设备名（本例中为 <code>/dev/vdb</code>）</li><li>将被使用的挂载点</li><li>格式化百分比</li></ul><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">vim</span> format.yaml
</code></pre></div><div class="language-yaml line-numbers-mode" data-ext="yml" data-title="yml"><pre class="language-yaml"><code><span class="token key atrule">host</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> server<span class="token punctuation">-</span>host1
  <span class="token punctuation">-</span> server<span class="token punctuation">-</span>host2
  <span class="token punctuation">-</span> server<span class="token punctuation">-</span>host3
<span class="token key atrule">disk</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> /dev/vdb<span class="token punctuation">:</span>/data/chunkserver0<span class="token punctuation">:</span><span class="token number">90</span> <span class="token comment"># device:mount_path:format_percent</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>开始格式化。此时，中控机将在每台存储节点主机上对每个块设备启动一个格式化进程容器。</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ curveadm <span class="token function">format</span> <span class="token parameter variable">-f</span> format.yaml
Start Format Chunkfile Pool: ⠸
  + <span class="token assign-left variable">host</span><span class="token operator">=</span>server-host1  <span class="token assign-left variable">device</span><span class="token operator">=</span>/dev/vdb  <span class="token assign-left variable">mountPoint</span><span class="token operator">=</span>/data/chunkserver0  <span class="token assign-left variable">usage</span><span class="token operator">=</span><span class="token number">90</span>% <span class="token punctuation">[</span><span class="token number">0</span>/1<span class="token punctuation">]</span> ⠸
  + <span class="token assign-left variable">host</span><span class="token operator">=</span>server-host2  <span class="token assign-left variable">device</span><span class="token operator">=</span>/dev/vdb  <span class="token assign-left variable">mountPoint</span><span class="token operator">=</span>/data/chunkserver0  <span class="token assign-left variable">usage</span><span class="token operator">=</span><span class="token number">90</span>% <span class="token punctuation">[</span><span class="token number">0</span>/1<span class="token punctuation">]</span> ⠸
  + <span class="token assign-left variable">host</span><span class="token operator">=</span>server-host3  <span class="token assign-left variable">device</span><span class="token operator">=</span>/dev/vdb  <span class="token assign-left variable">mountPoint</span><span class="token operator">=</span>/data/chunkserver0  <span class="token assign-left variable">usage</span><span class="token operator">=</span><span class="token number">90</span>% <span class="token punctuation">[</span><span class="token number">0</span>/1<span class="token punctuation">]</span> ⠸
</code></pre></div><p>当显示 <code>OK</code> 时，说明这个格式化进程容器已启动，但 <strong>并不代表格式化已经完成</strong>。格式化是个较久的过程，将会持续一段时间：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code>Start Format Chunkfile Pool: <span class="token punctuation">[</span>OK<span class="token punctuation">]</span>
  + <span class="token assign-left variable">host</span><span class="token operator">=</span>server-host1  <span class="token assign-left variable">device</span><span class="token operator">=</span>/dev/vdb  <span class="token assign-left variable">mountPoint</span><span class="token operator">=</span>/data/chunkserver0  <span class="token assign-left variable">usage</span><span class="token operator">=</span><span class="token number">90</span>% <span class="token punctuation">[</span><span class="token number">1</span>/1<span class="token punctuation">]</span> <span class="token punctuation">[</span>OK<span class="token punctuation">]</span>
  + <span class="token assign-left variable">host</span><span class="token operator">=</span>server-host2  <span class="token assign-left variable">device</span><span class="token operator">=</span>/dev/vdb  <span class="token assign-left variable">mountPoint</span><span class="token operator">=</span>/data/chunkserver0  <span class="token assign-left variable">usage</span><span class="token operator">=</span><span class="token number">90</span>% <span class="token punctuation">[</span><span class="token number">1</span>/1<span class="token punctuation">]</span> <span class="token punctuation">[</span>OK<span class="token punctuation">]</span>
  + <span class="token assign-left variable">host</span><span class="token operator">=</span>server-host3  <span class="token assign-left variable">device</span><span class="token operator">=</span>/dev/vdb  <span class="token assign-left variable">mountPoint</span><span class="token operator">=</span>/data/chunkserver0  <span class="token assign-left variable">usage</span><span class="token operator">=</span><span class="token number">90</span>% <span class="token punctuation">[</span><span class="token number">1</span>/1<span class="token punctuation">]</span> <span class="token punctuation">[</span>OK<span class="token punctuation">]</span>
</code></pre></div><p>可以通过以下命令查看格式化进度，目前仍在格式化状态中：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ curveadm <span class="token function">format</span> <span class="token parameter variable">--status</span>
Get Format Status: <span class="token punctuation">[</span>OK<span class="token punctuation">]</span>

Host          Device    MountPoint          Formatted  Status
----          ------    ----------          ---------  ------
server-host1  /dev/vdb  /data/chunkserver0  <span class="token number">19</span>/90      Formatting
server-host2  /dev/vdb  /data/chunkserver0  <span class="token number">22</span>/90      Formatting
server-host3  /dev/vdb  /data/chunkserver0  <span class="token number">22</span>/90      Formatting
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>格式化完成后的输出：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ curveadm <span class="token function">format</span> <span class="token parameter variable">--status</span>
Get Format Status: <span class="token punctuation">[</span>OK<span class="token punctuation">]</span>

Host          Device    MountPoint          Formatted  Status
----          ------    ----------          ---------  ------
server-host1  /dev/vdb  /data/chunkserver0  <span class="token number">95</span>/90      Done
server-host2  /dev/vdb  /data/chunkserver0  <span class="token number">95</span>/90      Done
server-host3  /dev/vdb  /data/chunkserver0  <span class="token number">95</span>/90      Done
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="部署-curvebs-集群" tabindex="-1"><a class="header-anchor" href="#部署-curvebs-集群"><span>部署 CurveBS 集群</span></a></h2><p>首先，准备集群配置文件：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">vim</span> topology.yaml
</code></pre></div><p>粘贴如下配置文件：</p><div class="language-yaml line-numbers-mode" data-ext="yml" data-title="yml"><pre class="language-yaml"><code><span class="token key atrule">kind</span><span class="token punctuation">:</span> curvebs
<span class="token key atrule">global</span><span class="token punctuation">:</span>
  <span class="token key atrule">container_image</span><span class="token punctuation">:</span> opencurvedocker/curvebs<span class="token punctuation">:</span>v1.2
  <span class="token key atrule">log_dir</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>home<span class="token punctuation">}</span>/logs/$<span class="token punctuation">{</span>service_role<span class="token punctuation">}</span>$<span class="token punctuation">{</span>service_replicas_sequence<span class="token punctuation">}</span>
  <span class="token key atrule">data_dir</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>home<span class="token punctuation">}</span>/data/$<span class="token punctuation">{</span>service_role<span class="token punctuation">}</span>$<span class="token punctuation">{</span>service_replicas_sequence<span class="token punctuation">}</span>
  <span class="token key atrule">s3.nos_address</span><span class="token punctuation">:</span> 127.0.0.1
  <span class="token key atrule">s3.snapshot_bucket_name</span><span class="token punctuation">:</span> curve
  <span class="token key atrule">s3.ak</span><span class="token punctuation">:</span> minioadmin
  <span class="token key atrule">s3.sk</span><span class="token punctuation">:</span> minioadmin
  <span class="token key atrule">variable</span><span class="token punctuation">:</span>
    <span class="token key atrule">home</span><span class="token punctuation">:</span> /tmp
    <span class="token key atrule">machine1</span><span class="token punctuation">:</span> server<span class="token punctuation">-</span>host1
    <span class="token key atrule">machine2</span><span class="token punctuation">:</span> server<span class="token punctuation">-</span>host2
    <span class="token key atrule">machine3</span><span class="token punctuation">:</span> server<span class="token punctuation">-</span>host3

<span class="token key atrule">etcd_services</span><span class="token punctuation">:</span>
  <span class="token key atrule">config</span><span class="token punctuation">:</span>
    <span class="token key atrule">listen.ip</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>service_host<span class="token punctuation">}</span>
    <span class="token key atrule">listen.port</span><span class="token punctuation">:</span> <span class="token number">2380</span>
    <span class="token key atrule">listen.client_port</span><span class="token punctuation">:</span> <span class="token number">2379</span>
  <span class="token key atrule">deploy</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>machine1<span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>machine2<span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>machine3<span class="token punctuation">}</span>

<span class="token key atrule">mds_services</span><span class="token punctuation">:</span>
  <span class="token key atrule">config</span><span class="token punctuation">:</span>
    <span class="token key atrule">listen.ip</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>service_host<span class="token punctuation">}</span>
    <span class="token key atrule">listen.port</span><span class="token punctuation">:</span> <span class="token number">6666</span>
    <span class="token key atrule">listen.dummy_port</span><span class="token punctuation">:</span> <span class="token number">6667</span>
  <span class="token key atrule">deploy</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>machine1<span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>machine2<span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>machine3<span class="token punctuation">}</span>

<span class="token key atrule">chunkserver_services</span><span class="token punctuation">:</span>
  <span class="token key atrule">config</span><span class="token punctuation">:</span>
    <span class="token key atrule">listen.ip</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>service_host<span class="token punctuation">}</span>
    <span class="token key atrule">listen.port</span><span class="token punctuation">:</span> 82$<span class="token punctuation">{</span>format_replicas_sequence<span class="token punctuation">}</span> <span class="token comment"># 8200,8201,8202</span>
    <span class="token key atrule">data_dir</span><span class="token punctuation">:</span> /data/chunkserver$<span class="token punctuation">{</span>service_replicas_sequence<span class="token punctuation">}</span> <span class="token comment"># /data/chunkserver0, /data/chunkserver1</span>
    <span class="token key atrule">copysets</span><span class="token punctuation">:</span> <span class="token number">100</span>
  <span class="token key atrule">deploy</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>machine1<span class="token punctuation">}</span>
      <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>machine2<span class="token punctuation">}</span>
      <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>machine3<span class="token punctuation">}</span>
      <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>

<span class="token key atrule">snapshotclone_services</span><span class="token punctuation">:</span>
  <span class="token key atrule">config</span><span class="token punctuation">:</span>
    <span class="token key atrule">listen.ip</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>service_host<span class="token punctuation">}</span>
    <span class="token key atrule">listen.port</span><span class="token punctuation">:</span> <span class="token number">5555</span>
    <span class="token key atrule">listen.dummy_port</span><span class="token punctuation">:</span> <span class="token number">8081</span>
    <span class="token key atrule">listen.proxy_port</span><span class="token punctuation">:</span> <span class="token number">8080</span>
  <span class="token key atrule">deploy</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>machine1<span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>machine2<span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>machine3<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>根据上述的集群拓扑文件创建集群 <code>my-cluster</code>：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code>curveadm cluster <span class="token function">add</span> my-cluster <span class="token parameter variable">-f</span> topology.yaml
</code></pre></div><p>切换 <code>my-cluster</code> 集群为当前管理集群：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code>curveadm cluster checkout my-cluster
</code></pre></div><p>部署集群。如果部署成功，将会输出类似 <code>Cluster &#39;my-cluster&#39; successfully deployed ^_^.</code> 字样。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ curveadm deploy <span class="token parameter variable">--skip</span> snapshotclone

<span class="token punctuation">..</span>.
Create Logical Pool: <span class="token punctuation">[</span>OK<span class="token punctuation">]</span>
  + <span class="token assign-left variable">host</span><span class="token operator">=</span>server-host1  <span class="token assign-left variable">role</span><span class="token operator">=</span>mds  <span class="token assign-left variable">containerId</span><span class="token operator">=</span>c6fdd71ae678 <span class="token punctuation">[</span><span class="token number">1</span>/1<span class="token punctuation">]</span> <span class="token punctuation">[</span>OK<span class="token punctuation">]</span>

Start Service: <span class="token punctuation">[</span>OK<span class="token punctuation">]</span>
  + <span class="token assign-left variable">host</span><span class="token operator">=</span>server-host1  <span class="token assign-left variable">role</span><span class="token operator">=</span>snapshotclone  <span class="token assign-left variable">containerId</span><span class="token operator">=</span>9d3555ba72fa <span class="token punctuation">[</span><span class="token number">1</span>/1<span class="token punctuation">]</span> <span class="token punctuation">[</span>OK<span class="token punctuation">]</span>
  + <span class="token assign-left variable">host</span><span class="token operator">=</span>server-host2  <span class="token assign-left variable">role</span><span class="token operator">=</span>snapshotclone  <span class="token assign-left variable">containerId</span><span class="token operator">=</span>e6ae2b23b57e <span class="token punctuation">[</span><span class="token number">1</span>/1<span class="token punctuation">]</span> <span class="token punctuation">[</span>OK<span class="token punctuation">]</span>
  + <span class="token assign-left variable">host</span><span class="token operator">=</span>server-host3  <span class="token assign-left variable">role</span><span class="token operator">=</span>snapshotclone  <span class="token assign-left variable">containerId</span><span class="token operator">=</span>f6d3446c7684 <span class="token punctuation">[</span><span class="token number">1</span>/1<span class="token punctuation">]</span> <span class="token punctuation">[</span>OK<span class="token punctuation">]</span>

Balance Leader: <span class="token punctuation">[</span>OK<span class="token punctuation">]</span>
  + <span class="token assign-left variable">host</span><span class="token operator">=</span>server-host1  <span class="token assign-left variable">role</span><span class="token operator">=</span>mds  <span class="token assign-left variable">containerId</span><span class="token operator">=</span>c6fdd71ae678 <span class="token punctuation">[</span><span class="token number">1</span>/1<span class="token punctuation">]</span> <span class="token punctuation">[</span>OK<span class="token punctuation">]</span>

Cluster <span class="token string">&#39;my-cluster&#39;</span> successfully deployed ^_^.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看集群状态：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ curveadm status
Get Service Status: <span class="token punctuation">[</span>OK<span class="token punctuation">]</span>

cluster name      <span class="token builtin class-name">:</span> my-cluster
cluster kind      <span class="token builtin class-name">:</span> curvebs
cluster mds addr  <span class="token builtin class-name">:</span> <span class="token number">172.16</span>.0.223:6666,172.16.0.224:6666,172.16.0.225:6666
cluster mds leader: <span class="token number">172.16</span>.0.225:6666 / d0a94a7afa14

Id            Role         Host          Replicas  Container Id  Status
--            ----         ----          --------  ------------  ------
5567a1c56ab9  etcd         server-host1  <span class="token number">1</span>/1       f894c5485a26  Up <span class="token number">17</span> seconds
68f9f0e6f108  etcd         server-host2  <span class="token number">1</span>/1       69b09cdbf503  Up <span class="token number">17</span> seconds
a678263898cc  etcd         server-host3  <span class="token number">1</span>/1       2ed141800731  Up <span class="token number">17</span> seconds
4dcbdd08e2cd  mds          server-host1  <span class="token number">1</span>/1       76d62ff0eb25  Up <span class="token number">17</span> seconds
8ef1755b0a10  mds          server-host2  <span class="token number">1</span>/1       d8d838258a6f  Up <span class="token number">17</span> seconds
f3599044c6b5  mds          server-host3  <span class="token number">1</span>/1       d63ae8502856  Up <span class="token number">17</span> seconds
9f1d43bc5b03  chunkserver  server-host1  <span class="token number">1</span>/1       39751a4f49d5  Up <span class="token number">16</span> seconds
3fb8fd7b37c1  chunkserver  server-host2  <span class="token number">1</span>/1       0f55a19ed44b  Up <span class="token number">16</span> seconds
c4da555952e3  chunkserver  server-host3  <span class="token number">1</span>/1       9411274d2c97  Up <span class="token number">16</span> seconds
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="部署-curvebs-客户端" tabindex="-1"><a class="header-anchor" href="#部署-curvebs-客户端"><span>部署 CurveBS 客户端</span></a></h2><p>在 Curve 中控机上编辑客户端配置文件：</p><div class="language-bash" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">vim</span> client.yaml
</code></pre></div><p>注意，这里的 <code>mds.listen.addr</code> 请填写上一步集群状态中输出的 <code>cluster mds addr</code>：</p><div class="language-yaml" data-ext="yml" data-title="yml"><pre class="language-yaml"><code><span class="token key atrule">kind</span><span class="token punctuation">:</span> curvebs
<span class="token key atrule">container_image</span><span class="token punctuation">:</span> opencurvedocker/curvebs<span class="token punctuation">:</span>v1.2
<span class="token key atrule">mds.listen.addr</span><span class="token punctuation">:</span> 172.16.0.223<span class="token punctuation">:</span><span class="token number">6666</span><span class="token punctuation">,</span>172.16.0.224<span class="token punctuation">:</span><span class="token number">6666</span><span class="token punctuation">,</span>172.16.0.225<span class="token punctuation">:</span><span class="token number">6666</span>
<span class="token key atrule">log_dir</span><span class="token punctuation">:</span> /root/curvebs/logs/client
</code></pre></div><hr><h2 id="准备分布式文件系统" tabindex="-1"><a class="header-anchor" href="#准备分布式文件系统"><span>准备分布式文件系统</span></a></h2>`,43);function D(p,I){const l=t("Badge"),c=t("ArticleInfo"),e=t("ExternalLinkIcon"),o=t("RouteLink");return u(),r("div",null,[s("h1",b,[s("a",h,[s("span",null,[n("CurveBS 共享存储 "),s("a",g,[a(l,{type:"tip",text:"视频",vertical:"top"})])])])]),a(c,{frontmatter:p.$frontmatter},null,8,["frontmatter"]),s("p",null,[s("a",y,[n("Curve"),a(e)]),n(" 是一款高性能、易运维、云原生的开源分布式存储系统。可应用于主流的云原生基础设施平台：")]),f,_,s("p",null,[n("本示例将引导您以 CurveBS 作为块存储，部署 PolarDB for PostgreSQL。更多进阶配置和使用方法请参考 Curve 项目的 "),s("a",S,[n("wiki"),a(e)]),n("。")]),x,C,$,s("p",null,[n("本示例使用阿里云 ECS 模拟全部六台服务器。六台 ECS 全部运行 "),s("a",B,[n("Anolis OS"),a(e)]),n(" 8.6（兼容 CentOS 8.6）系统，使用 root 用户，并处于同一局域网段内。需要完成的准备工作包含：")]),s("ol",null,[s("li",null,[n("在全部机器上安装 "),s("a",P,[n("Docker"),a(e)]),n("（请参考 Docker 官方文档）")]),O]),K,s("p",null,[n("接下来，将在两台运行 PolarDB 计算节点的 ECS 上分别部署 PolarDB 的主节点和只读节点。作为前提，需要让这两个节点能够共享 CurveBS 块设备，并在块设备上 "),a(o,{to:"/zh/deploying/fs-pfs-curve.html"},{default:d(()=>[n("格式化并挂载 PFS")]),_:1}),n("。")])])}const L=i(m,[["render",D],["__file","storage-curvebs.html.vue"]]),U=JSON.parse('{"path":"/zh/deploying/storage-curvebs.html","title":"CurveBS 共享存储","lang":"zh-CN","frontmatter":{"author":"棠羽","date":"2022/08/31","minute":30},"headers":[{"level":2,"title":"设备准备","slug":"设备准备","link":"#设备准备","children":[]},{"level":2,"title":"在中控机上安装 CurveAdm","slug":"在中控机上安装-curveadm","link":"#在中控机上安装-curveadm","children":[]},{"level":2,"title":"导入主机列表","slug":"导入主机列表","link":"#导入主机列表","children":[]},{"level":2,"title":"格式化磁盘","slug":"格式化磁盘","link":"#格式化磁盘","children":[]},{"level":2,"title":"部署 CurveBS 集群","slug":"部署-curvebs-集群","link":"#部署-curvebs-集群","children":[]},{"level":2,"title":"部署 CurveBS 客户端","slug":"部署-curvebs-客户端","link":"#部署-curvebs-客户端","children":[]},{"level":2,"title":"准备分布式文件系统","slug":"准备分布式文件系统","link":"#准备分布式文件系统","children":[]}],"git":{"updatedTime":1725527283000},"filePathRelative":"zh/deploying/storage-curvebs.md"}');export{L as comp,U as data};
