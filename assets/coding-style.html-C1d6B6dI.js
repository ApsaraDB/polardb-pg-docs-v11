import{_ as i,r as s,o as a,c as r,a as e,b as o,d as n,e as l}from"./app-4enb6FVN.js";const d={},c=l('<h1 id="编码风格" tabindex="-1"><a class="header-anchor" href="#编码风格"><span>编码风格</span></a></h1><div class="custom-container danger"><p class="custom-container-title">警告</p><p>需要翻译</p></div><h2 id="languages" tabindex="-1"><a class="header-anchor" href="#languages"><span>Languages</span></a></h2><ul><li>PostgreSQL kernel, extension, and kernel related tools use C, in order to remain compatible with community versions and to easily upgrade.</li><li>Management related tools can use shell, GO, or Python, for efficient development.</li></ul><h2 id="style" tabindex="-1"><a class="header-anchor" href="#style"><span>Style</span></a></h2>',5),h={href:"https://www.postgresql.org/docs/12/source.html",target:"_blank",rel:"noopener noreferrer"},u=e("ul",null,[e("li",null,"Code in PostgreSQL should only rely on language features available in the C99 standard"),e("li",null,"Do not use // for comments"),e("li",null,"Both, macros with arguments and static inline functions, may be used. The latter is preferred only if the former simplifies coding."),e("li",null,"Follow BSD C programming conventions")],-1),m=e("li",null,[e("p",null,"Programs in Shell, Go, or Python can follow Google code conventions"),e("ul",null,[e("li",null,"https://google.github.io/styleguide/pyguide.html"),e("li",null,"https://github.com/golang/go/wiki/CodeReviewComments"),e("li",null,"https://google.github.io/styleguide/shellguide.html")])],-1),g=e("h2",{id:"code-design-and-review",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#code-design-and-review"},[e("span",null,"Code design and review")])],-1),p={href:"https://github.com/google/eng-practices/blob/master/review/index.md",target:"_blank",rel:"noopener noreferrer"},f=l("<p>Before submitting for code review, please do unit test and pass all tests under src/test, such as regress and isolation. Unit tests or function tests should be submitted with code modification.</p><p>In addition to code review, this doc offers instructions for the whole cycle of high-quality development, from design, implementation, testing, documentation, to preparing for code review. Many good questions are asked for critical steps during development, such as about design, about function, about complexity, about test, about naming, about documentation, and about code review. The doc summarized rules for code review as follows.</p><p><em>In doing a code review, you should make sure that:</em></p><ul><li><em>The code is well-designed.</em></li><li><em>The functionality is good for the users of the code.</em></li><li><em>Any UI changes are sensible and look good.</em></li><li><em>Any parallel programming is done safely.</em></li><li><em>The code isn&#39;t more complex than it needs to be.</em></li><li><em>The developer isn&#39;t implementing things they might need in the future but don&#39;t know they need now.</em></li><li><em>Code has appropriate unit tests.</em></li><li><em>Tests are well-designed.</em></li><li><em>The developer used clear names for everything.</em></li><li><em>Comments are clear and useful, and mostly explain why instead of what.</em></li><li><em>Code is appropriately documented.</em></li><li><em>The code conforms to our style guides.</em></li></ul>",4);function y(v,b){const t=s("ExternalLinkIcon");return a(),r("div",null,[c,e("ul",null,[e("li",null,[e("p",null,[o("Coding in C follows PostgreSQL's programing style， such as naming, error message format, control statements, length of lines, comment format, length of functions, and global variable. For detail, please reference "),e("a",h,[o("Postgresql style"),n(t)]),o(". Here is some highlines:")]),u]),m]),g,e("p",null,[o("We share the same thoughts and rules as "),e("a",p,[o("Google Open Source Code Review"),n(t)])]),f])}const _=i(d,[["render",y],["__file","coding-style.html.vue"]]),k=JSON.parse('{"path":"/zh/contributing/coding-style.html","title":"编码风格","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"Languages","slug":"languages","link":"#languages","children":[]},{"level":2,"title":"Style","slug":"style","link":"#style","children":[]},{"level":2,"title":"Code design and review","slug":"code-design-and-review","link":"#code-design-and-review","children":[]}],"git":{"updatedTime":1725527283000},"filePathRelative":"zh/contributing/coding-style.md"}');export{_ as comp,k as data};
