import { CodeBlock, Content, Eyebrow, SlideShell, SlideTitle } from '../ui'

const personaCode = `# ① LLM 调用：只负责回忆相关主题的维基 URL
class FindRelatedTopic(dspy.Signature):
    """我正在为下面这个主题写一篇维基百科页面。请识别并推荐一些与之密切相关主题的维基百科页面。
    我想要的是那些能帮我洞察这个主题常见有趣侧面的例子，或者能帮我理解同类主题的维基百科页面
    通常包含哪些内容、是怎么组织结构的例子。
    请把这些 URL 逐行列出。"""
    topic = dspy.InputField(prefix="感兴趣的主题：", format=str)
    related_topics = dspy.OutputField(format=str)

# ② 纯代码：访问真实 URL，抓取标题和目录
def get_wiki_page_title_and_toc(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    main_title = soup.find("h1").text.strip()
    toc = ""
    for header in soup.find_all(["h2", "h3", "h4", "h5", "h6"]):
        section_title = header.text.strip()
        if section_title in {"Contents", "References", "See also"}:
            continue
        toc += section_title + "\\n"
    return main_title, toc.strip()

# ③ LLM 调用：根据真实抓到的目录归纳编辑视角
class GenPersona(dspy.Signature):
    """你需要挑选一组维基百科编辑者，他们将共同协作，为这个主题撰写一篇内容全面的文章。
    每个人代表一个与该主题相关的不同视角、角色或立场。你可以参考其他相关主题的维基百科页面
    来获取灵感。为每位编辑者补充一段描述，说明他们会重点关注什么。
    请按以下格式作答：1. 编辑者的简要概述：描述 2. 编辑者的简要概述：描述…"""
    topic = dspy.InputField(prefix="感兴趣的主题：", format=str)
    examples = dspy.InputField(prefix="用于启发的相关主题维基页面目录：\\n", format=str)
    personas = dspy.OutputField(format=str)

def forward(self, topic: str, draft=None):
    # 第一次 LLM 调用：生成候选 URL
    related_topics = self.find_related_topic(topic=topic).related_topics
    urls = [s[s.find("http"):] for s in related_topics.split("\\n") if "http" in s]

    # 中间是确定性的网页访问与目录提取，不是 LLM 调用
    examples = [get_wiki_page_title_and_toc(url) for url in urls]

    # 第二次 LLM 调用：从真实目录中归纳视角
    personas = self.gen_persona(
        topic=topic, examples="\\n----------\\n".join(examples)
    ).personas
    return personas`

const outputs = [
  {
    num: '01',
    label: 'LLM CALL · 生成相关维基 URL',
    content: (
      <>
        <div>https://en.wikipedia.org/wiki/Artificial_intelligence</div>
        <div>https://en.wikipedia.org/wiki/Natural_language_generation</div>
        <div>https://en.wikipedia.org/wiki/Computer-assisted_writing</div>
      </>
    ),
  },
  {
    num: '02',
    label: 'CODE · 抓取标题和目录',
    content: (
      <>
        <div className="mb-1 text-ink">Natural language generation</div>
        <div>Methods · Applications · Evaluation · Challenges</div>
        <div className="mt-2 mb-1 text-ink">Computer-assisted writing</div>
        <div>History · Writing tools · Language checking · Text generation</div>
      </>
    ),
  },
  {
    num: '03',
    label: 'LLM CALL · 生成编辑视角',
    content: (
      <>
        <div>技术原理编辑者：语言模型、文本生成、系统实现</div>
        <div>写作实践编辑者：构思、修改、润色与工具协作</div>
        <div>教育研究编辑者：教学效果、应用边界与风险</div>
      </>
    ),
  },
] as const

export default function Slide05_02PersonaGeneration() {
  return (
    <SlideShell>
      <Eyebrow>方法论 · STORM 多视角机制</Eyebrow>
      <SlideTitle>多视角不是一次生成：两次 LLM 调用，中间穿过真实目录</SlideTitle>
      <Content className="justify-start gap-4">
        <p className="m-2 max-w-[1160px] text-center text-[1rem] leading-[1.55] text-ink-2">
          STORM 不直接让模型凭空“想几个角色”，而是把视角生成拆成两次窄任务调用：先找同类页面，再把真实抓到的目录交给模型归纳编辑视角。
        </p>
        <div className="mt-10 grid w-full max-w-[1440px] grid-cols-[1.08fr_0.92fr] items-start gap-6">
          <CodeBlock
            code={personaCode}
            fileLabel="storm_wiki/modules/persona_generator.py · CreateWriterWithPersona.forward()"
            dense
            scrollable
            className="min-w-0"
          />
          <div className="flex min-w-0 flex-col gap-3">
            {outputs.map((output, index) => (
              <div
                key={output.num}
                className="rounded-[10px] border border-line border-l-4 border-l-line-2 bg-panel px-5 py-3"
              >
                <div className="mb-2 flex items-center gap-2 font-mono text-[0.64rem] tracking-[0.04em] text-muted">
                  <span className="text-accent">{output.num}</span>
                  <span>{output.label}</span>
                  {index !== 1 ? <span className="text-[#f5c542]">★</span> : null}
                </div>
                <div className="space-y-1 font-mono text-[0.67rem] leading-[1.45] text-ink-2">{output.content}</div>
              </div>
            ))}
            <p className="m-0 pt-1 text-[0.78rem] leading-[1.5] text-ink-2">
              关键边界：第 ①、③ 步是 LLM 调用；第 ② 步由 requests + BeautifulSoup 读取真实页面。模型负责归纳，代码负责验证和整理。
            </p>
          </div>
        </div>
        <p className="m-10 max-w-[1260px] text-center text-[0.86rem] leading-[1.55] text-ink-2">
          <span className="mr-2 text-[1rem]">💡</span>
          <b className="text-ink">对我们的公文 Agent：</b>可以从自有公文库中检索相似文种、相似主题的公文，读取它们的目录与结构作为先验，再据此生成公文场景下的编辑视角，而不是让模型凭空回忆维基百科 URL。
        </p>
      </Content>
    </SlideShell>
  )
}
