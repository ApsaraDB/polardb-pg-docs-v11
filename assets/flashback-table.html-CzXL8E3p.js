import{_ as p,r as o,o as r,c as i,d as e,a,w as s,e as k,b as n}from"./app-4enb6FVN.js";const u={},_=a("h1",{id:"闪回表和闪回日志",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#闪回表和闪回日志"},[a("span",null,"闪回表和闪回日志")])],-1),h={class:"table-of-contents"},b=k(`<h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>目前文件系统并不能保证数据库页面级别的原子读写，在一次页面的 I/O 过程中，如果发生设备断电等情况，就会造成页面数据的错乱和丢失。在实现闪回表的过程中，我们发现通过定期保存旧版本数据页 + WAL 日志回放的方式可以得到任意时间点的数据页，这样就可以解决半写问题。这种方式和 PostgreSQL 原生的 Full Page Write 相比，由于不在事务提交的主路径上，因此性能有了约 30% ~ 100% 的提升。实例规格越大，负载压力越大，效果越明显。</p><p><strong>闪回日志 (Flashback Log)</strong> 用于保存压缩后的旧版本数据页。其解决半写问题的方案如下：</p><ol><li>对 Shared Buffer 中的每个 buffer，在每次 <strong>闪回点 (Flashback Point)</strong> 后第一次修改页面期间，记录 Flashback Log，保存该版本的数据页面</li><li>Flashback Log 顺序落盘</li><li>维护 Flashback Log 的日志索引，用于快速检索某个数据页与其对应的 Flashback Log 记录</li></ol><p>当遭遇半写问题（数据页 checksum 不正确）时，通过日志索引快速找到该页对应的 Flashback Log 记录，通过 Flashback Log 记录可以得到旧版本的正确数据页，用于替换被损坏的页。在文件系统不能保证 8kB 级别原子读写的任何设备上，都可以使用这个功能。需要特别注意的是，启用这个功能会造成一定的性能下降。</p><p><strong>闪回表 (Flashback Table)</strong> 功能通过定期保留数据页面快照到闪回日志中，保留事务信息到快速恢复区中，支持用户将某个时刻的表数据恢复到一个新的表中。</p><h2 id="使用方法" tabindex="-1"><a class="header-anchor" href="#使用方法"><span>使用方法</span></a></h2><h3 id="语法" tabindex="-1"><a class="header-anchor" href="#语法"><span>语法</span></a></h3><div class="language-sql" data-ext="sql" data-title="sql"><pre class="language-sql"><code>FLASHBACK <span class="token keyword">TABLE</span>
    <span class="token punctuation">[</span> <span class="token keyword">schema</span><span class="token punctuation">.</span> <span class="token punctuation">]</span><span class="token keyword">table</span>
    <span class="token keyword">TO</span> <span class="token keyword">TIMESTAMP</span> expr<span class="token punctuation">;</span>
</code></pre></div><h3 id="示例" tabindex="-1"><a class="header-anchor" href="#示例"><span>示例</span></a></h3><p>准备测试数据。创建表 <code>test</code>，并插入数据：</p><div class="language-sql" data-ext="sql" data-title="sql"><pre class="language-sql"><code><span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> test<span class="token punctuation">(</span>id <span class="token keyword">int</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> test <span class="token keyword">select</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> generate_series<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">10000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><p>查看已插入的数据：</p><div class="language-sql" data-ext="sql" data-title="sql"><pre class="language-sql"><code>polardb<span class="token operator">=</span><span class="token comment"># SELECT count(1) FROM test;</span>
 count
<span class="token comment">-------</span>
 <span class="token number">10000</span>
<span class="token punctuation">(</span><span class="token number">1</span> <span class="token keyword">row</span><span class="token punctuation">)</span>

polardb<span class="token operator">=</span><span class="token comment"># SELECT sum(id) FROM test;</span>
   sum
<span class="token comment">----------</span>
 <span class="token number">50005000</span>
<span class="token punctuation">(</span><span class="token number">1</span> <span class="token keyword">row</span><span class="token punctuation">)</span>
</code></pre></div><p>等待 10 秒并删除表数据：</p><div class="language-sql" data-ext="sql" data-title="sql"><pre class="language-sql"><code><span class="token keyword">SELECT</span> pg_sleep<span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">DELETE</span> <span class="token keyword">FROM</span> test<span class="token punctuation">;</span>
</code></pre></div><p>表中已无数据：</p><div class="language-sql" data-ext="sql" data-title="sql"><pre class="language-sql"><code>polardb<span class="token operator">=</span><span class="token comment"># SELECT * FROM test;</span>
 id
<span class="token comment">----</span>
<span class="token punctuation">(</span><span class="token number">0</span> <span class="token keyword">rows</span><span class="token punctuation">)</span>
</code></pre></div><p>闪回表到 10 秒之前的数据：</p><div class="language-sql" data-ext="sql" data-title="sql"><pre class="language-sql"><code>polardb<span class="token operator">=</span><span class="token comment"># FLASHBACK TABLE test TO TIMESTAMP now() - interval&#39;10s&#39;;</span>
NOTICE:  Flashback the relation test <span class="token keyword">to</span> new relation polar_flashback_65566<span class="token punctuation">,</span> please <span class="token keyword">check</span> the <span class="token keyword">data</span>
FLASHBACK <span class="token keyword">TABLE</span>
</code></pre></div><p>检查闪回表数据：</p><div class="language-sql" data-ext="sql" data-title="sql"><pre class="language-sql"><code>polardb<span class="token operator">=</span><span class="token comment"># SELECT count(1) FROM polar_flashback_65566;</span>
 count
<span class="token comment">-------</span>
 <span class="token number">10000</span>
<span class="token punctuation">(</span><span class="token number">1</span> <span class="token keyword">row</span><span class="token punctuation">)</span>

polardb<span class="token operator">=</span><span class="token comment"># SELECT sum(id) FROM polar_flashback_65566;</span>
   sum
<span class="token comment">----------</span>
 <span class="token number">50005000</span>
<span class="token punctuation">(</span><span class="token number">1</span> <span class="token keyword">row</span><span class="token punctuation">)</span>
</code></pre></div><h2 id="实践指南" tabindex="-1"><a class="header-anchor" href="#实践指南"><span>实践指南</span></a></h2><p>闪回表功能依赖闪回日志和快速恢复区功能，需要设置 <code>polar_enable_flashback_log</code> 和 <code>polar_enable_fast_recovery_area</code> 参数并重启。其他的参数也需要按照需求来修改，建议一次性修改完成并在业务低峰期重启。打开闪回表功能将会增大内存、磁盘的占用量，并带来一定的性能损失，请谨慎评估后再使用。</p><h3 id="内存占用" tabindex="-1"><a class="header-anchor" href="#内存占用"><span>内存占用</span></a></h3><p>打开闪回日志功能需要增加的共享内存大小为以下三项之和：</p><ul><li><code>polar_flashback_log_buffers</code> * 8kB</li><li><code>polar_flashback_logindex_mem_size</code> MB</li><li><code>polar_flashback_logindex_queue_buffers</code> MB</li></ul><p>打开快速恢复区需要增加大约 32kB 的共享内存大小，请评估当前实例状态后再调整参数。</p><h3 id="磁盘占用" tabindex="-1"><a class="header-anchor" href="#磁盘占用"><span>磁盘占用</span></a></h3><p>为了保证能够闪回到一定时间之前，需要保留该段时间的闪回日志和 WAL 日志，以及两者的 LogIndex 文件，这会增加磁盘空间的占用。理论上 <code>polar_fast_recovery_area_rotation</code> 设置得越大，磁盘占用越多。若 <code>polar_fast_recovery_area_rotation</code> 设置为 <code>300</code>，则将会保存 5 个小时的历史数据。</p><p>打开闪回日志之后，会定期去做 <strong>闪回点（Flashback Point)</strong>。闪回点是检查点的一种，当触发检查点后会检查 <code>polar_flashback_point_segments</code> 和 <code>polar_flashback_point_timeout</code> 参数来判断当前检查点是否为闪回点。所以建议：</p><ul><li>设置 <code>polar_flashback_point_segments</code> 为 <code>max_wal_size</code> 的倍数</li><li>设置 <code>polar_flashback_point_timeout</code> 为 <code>checkpoint_timeout</code> 的倍数</li></ul><p>假设 5 个小时共产生 20GB 的 WAL 日志，闪回日志与 WAL 日志的比例大约是 1:20，那么大约会产生 1GB 的闪回日志。闪回日志和 WAL 日志的比例大小和以下两个因素有关：</p><ul><li>业务模型中，写业务越多，闪回日志越多</li><li><code>polar_flashback_point_segments</code>、<code>polar_flashback_point_timeout</code> 参数设定越大，闪回日志越少</li></ul><h3 id="性能影响" tabindex="-1"><a class="header-anchor" href="#性能影响"><span>性能影响</span></a></h3><p>闪回日志特性增加了两个后台进程来消费闪回日志，这势必会增大 CPU 的开销。可以调整 <code>polar_flashback_log_bgwrite_delay</code> 和 <code>polar_flashback_log_insert_list_delay</code> 参数使得两个后台进程工作间隔周期更长，从而减少 CPU 消耗，但是这可能会造成一定性能的下降，建议使用默认值即可。</p><p>另外，由于闪回日志功能需要在该页面刷脏之前，先刷对应的闪回日志，来保证不丢失闪回日志，所以可能会造成一定的性能下降。目前测试在大多数场景下性能下降不超过 5%。</p><p>在表闪回的过程中，目标表涉及到的页面在共享内存池中换入换出，可能会造成其他数据库访问操作的性能抖动。</p><h3 id="使用限制" tabindex="-1"><a class="header-anchor" href="#使用限制"><span>使用限制</span></a></h3><p>目前闪回表功能会恢复目标表的数据到一个新表中，表名为 <code>polar_flashback_目标表 OID</code>。在执行 <code>FLASHBACK TABLE</code> 语法后会有如下 <code>NOTICE</code> 提示：</p><div class="language-sql" data-ext="sql" data-title="sql"><pre class="language-sql"><code>polardb<span class="token operator">=</span><span class="token comment"># flashback table test to timestamp now() - interval &#39;1h&#39;;</span>
NOTICE:  Flashback the relation test <span class="token keyword">to</span> new relation polar_flashback_54986<span class="token punctuation">,</span> please <span class="token keyword">check</span> the <span class="token keyword">data</span>
FLASHBACK <span class="token keyword">TABLE</span>
</code></pre></div><p>其中的 <code>polar_flashback_54986</code> 就是闪回恢复出的临时表，只恢复表数据到目标时刻。目前只支持 <strong>普通表</strong> 的闪回，不支持以下数据库对象：</p><ul><li>索引</li><li>Toast 表</li><li>物化视图</li><li>分区表 / 分区子表</li><li>系统表</li><li>外表</li><li>含有 toast 子表的表</li></ul><p>另外，如果在目标时间到当前时刻对表执行过某些 DDL，则无法闪回：</p><ul><li><code>DROP TABLE</code></li><li><code>ALTER TABLE SET WITH OIDS</code></li><li><code>ALTER TABLE SET WITHOUT OIDS</code></li><li><code>TRUNCATE TABLE</code></li><li>修改列类型，修改前后的类型不可以直接隐式转换，且不是无需增加其他值安全强制转换的 USING 子句</li><li>修改表为 <code>UNLOGGED</code> 或者 <code>LOGGED</code></li><li>增加 <code>IDENTITY</code> 的列</li><li>增加有约束限制的列</li><li>增加默认值表达式含有易变的函数的列</li></ul><p>其中 <code>DROP TABLE</code> 的闪回可以使用 PolarDB for PostgreSQL/Oracle 的闪回删除功能来恢复。</p><h3 id="使用建议" tabindex="-1"><a class="header-anchor" href="#使用建议"><span>使用建议</span></a></h3><p>当出现人为误操作数据的情况时，建议先使用审计日志快速定位到误操作发生的时间，然后将目标表闪回到该时间之前。在表闪回过程中，会持有目标表的排他锁，因此仅可以对目标表进行查询操作。另外，在表闪回的过程中，目标表涉及到的页面在共享内存池中换入换出，可能会造成其他数据库访问操作的性能抖动。因此，建议在业务低峰期执行闪回操作。</p><p>闪回的速度和表的大小相关。当表比较大时，为节约时间，可以加大 <code>polar_workers_per_flashback_table</code> 参数，增加并行闪回的 worker 个数。</p><p>在表闪回结束后，可以根据 <code>NOTICE</code> 的提示，查询对应闪回表的数据，和原表的数据进行比对。闪回表上不会有任何索引，用户可以根据查询需要自行创建索引。在数据比对完成之后，可以将缺失的数据重新回流到原表。</p><h2 id="详细参数列表" tabindex="-1"><a class="header-anchor" href="#详细参数列表"><span>详细参数列表</span></a></h2><table><thead><tr><th>参数名</th><th>参数含义</th><th>取值范围</th><th>默认值</th><th>生效方法</th></tr></thead><tbody><tr><td><code>polar_enable_flashback_log</code></td><td>是否打开闪回日志</td><td><code>on</code> / <code>off</code></td><td><code>off</code></td><td>修改配置文件后重启生效</td></tr><tr><td><code>polar_enable_fast_recovery_area</code></td><td>是否打开快速恢复区</td><td><code>on</code> / <code>off</code></td><td><code>off</code></td><td>修改配置文件后重启生效</td></tr><tr><td><code>polar_flashback_log_keep_segments</code></td><td>闪回日志保留的文件个数，可重用。每个文件 256MB</td><td><code>[3, 2147483647]</code></td><td><code>8</code></td><td><code>SIGHUP</code> 生效</td></tr><tr><td><code>polar_fast_recovery_area_rotation</code></td><td>快速恢复区保留的事务信息时长，单位为分钟，即最大可闪回表到几分钟之前。</td><td><code>[1, 14400]</code></td><td><code>180</code></td><td><code>SIGHUP</code> 生效</td></tr><tr><td><code>polar_flashback_point_segments</code></td><td>两个闪回点之间的最小 WAL 日志个数，每个 WAL 日志 1GB</td><td><code>[1, 2147483647]</code></td><td><code>16</code></td><td><code>SIGHUP</code> 生效</td></tr><tr><td><code>polar_flashback_point_timeout</code></td><td>两个闪回点之间的最小时间间隔，单位为秒</td><td><code>[1, 86400]</code></td><td><code>300</code></td><td><code>SIGHUP</code> 生效</td></tr><tr><td><code>polar_flashback_log_buffers</code></td><td>闪回日志共享内存大小，单位为 8kB</td><td><code>[4, 262144]</code></td><td><code>2048</code> (16MB)</td><td>修改配置文件后重启生效</td></tr><tr><td><code>polar_flashback_logindex_mem_size</code></td><td>闪回日志索引共享内存大小，单位为 MB</td><td><code>[3, 1073741823]</code></td><td><code>64</code></td><td>修改配置文件后重启生效</td></tr><tr><td><code>polar_flashback_logindex_bloom_blocks</code></td><td>闪回日志索引的布隆过滤器页面个数</td><td><code>[8, 1073741823]</code></td><td><code>512</code></td><td>修改配置文件后重启生效</td></tr><tr><td><code>polar_flashback_log_insert_locks</code></td><td>闪回日志插入锁的个数</td><td><code>[1, 2147483647]</code></td><td><code>8</code></td><td>修改配置文件后重启生效</td></tr><tr><td><code>polar_workers_per_flashback_table</code></td><td>闪回表并行 worker 的数量</td><td><code>[0, 1024]</code> (0 为关闭并行)</td><td><code>5</code></td><td>即时生效</td></tr><tr><td><code>polar_flashback_log_bgwrite_delay</code></td><td>闪回日志 bgwriter 进程的工作间隔周期，单位为 ms</td><td><code>[1, 10000]</code></td><td><code>100</code></td><td><code>SIGHUP</code> 生效</td></tr><tr><td><code>polar_flashback_log_flush_max_size</code></td><td>闪回日志 bgwriter 进程每次刷盘闪回日志的大小，单位为 kB</td><td><code>[0, 2097152]</code> (0 为不限制)</td><td><code>5120</code></td><td><code>SIGHUP</code> 生效</td></tr><tr><td><code>polar_flashback_log_insert_list_delay</code></td><td>闪回日志 bginserter 进程的工作间隔周期，单位为 ms</td><td><code>[1, 10000]</code></td><td><code>10</code></td><td><code>SIGHUP</code> 生效</td></tr></tbody></table>`,52);function f(l,g){const d=o("Badge"),c=o("ArticleInfo"),t=o("router-link");return r(),i("div",null,[_,e(d,{type:"tip",text:"V11 / v1.1.22-",vertical:"top"}),e(c,{frontmatter:l.$frontmatter},null,8,["frontmatter"]),a("nav",h,[a("ul",null,[a("li",null,[e(t,{to:"#概述"},{default:s(()=>[n("概述")]),_:1})]),a("li",null,[e(t,{to:"#使用方法"},{default:s(()=>[n("使用方法")]),_:1}),a("ul",null,[a("li",null,[e(t,{to:"#语法"},{default:s(()=>[n("语法")]),_:1})]),a("li",null,[e(t,{to:"#示例"},{default:s(()=>[n("示例")]),_:1})])])]),a("li",null,[e(t,{to:"#实践指南"},{default:s(()=>[n("实践指南")]),_:1}),a("ul",null,[a("li",null,[e(t,{to:"#内存占用"},{default:s(()=>[n("内存占用")]),_:1})]),a("li",null,[e(t,{to:"#磁盘占用"},{default:s(()=>[n("磁盘占用")]),_:1})]),a("li",null,[e(t,{to:"#性能影响"},{default:s(()=>[n("性能影响")]),_:1})]),a("li",null,[e(t,{to:"#使用限制"},{default:s(()=>[n("使用限制")]),_:1})]),a("li",null,[e(t,{to:"#使用建议"},{default:s(()=>[n("使用建议")]),_:1})])])]),a("li",null,[e(t,{to:"#详细参数列表"},{default:s(()=>[n("详细参数列表")]),_:1})])])]),b])}const w=p(u,[["render",f],["__file","flashback-table.html.vue"]]),T=JSON.parse('{"path":"/zh/features/v11/availability/flashback-table.html","title":"闪回表和闪回日志","lang":"zh-CN","frontmatter":{"author":"恒亦","date":"2022/11/23","minute":20},"headers":[{"level":2,"title":"概述","slug":"概述","link":"#概述","children":[]},{"level":2,"title":"使用方法","slug":"使用方法","link":"#使用方法","children":[{"level":3,"title":"语法","slug":"语法","link":"#语法","children":[]},{"level":3,"title":"示例","slug":"示例","link":"#示例","children":[]}]},{"level":2,"title":"实践指南","slug":"实践指南","link":"#实践指南","children":[{"level":3,"title":"内存占用","slug":"内存占用","link":"#内存占用","children":[]},{"level":3,"title":"磁盘占用","slug":"磁盘占用","link":"#磁盘占用","children":[]},{"level":3,"title":"性能影响","slug":"性能影响","link":"#性能影响","children":[]},{"level":3,"title":"使用限制","slug":"使用限制","link":"#使用限制","children":[]},{"level":3,"title":"使用建议","slug":"使用建议","link":"#使用建议","children":[]}]},{"level":2,"title":"详细参数列表","slug":"详细参数列表","link":"#详细参数列表","children":[]}],"git":{"updatedTime":1725527283000},"filePathRelative":"zh/features/v11/availability/flashback-table.md"}');export{w as comp,T as data};
