export const data_instructions = {
    txtclass: `## Supported Data Formats and Structures:

### JSONL
Each line is a JSON object representing an example.
\`\`\`json
{"text": "The text content", "label": "The label"}
\`\`\`

### CSV
Should contain 'text' and 'label' columns.
\`\`\`csv
text,label
"The text content","The label"
\`\`\`

### Parquet
Should contain 'text' and 'label' columns.

### JSON
An array of dictionaries with 'text' and 'label' keys.
\`\`\`json
[{"text": "The text content", "label": "The label"}]
\`\`\`

### XML
Each 'record' element should contain 'text' and 'label' child elements.
\`\`\`xml
<record>
    <text>The text content</text>
    <label>The label</label>
</record>
\`\`\`

### YAML
Each document should be a dictionary with 'text' and 'label' keys.
\`\`\`yaml
- text: "The text content"
label: "The label"
\`\`\`

### TSV
Should contain 'text' and 'label' columns separated by tabs.

### Excel (.xls, .xlsx)
Should contain 'text' and 'label' columns.

### SQLite (.db)
Should contain a table with 'text' and 'label' columns.

### Feather
Should contain 'text' and 'label' columns.`,
    emotion: `## Supported Data Formats and Structures:

### JSONL
Each line is a JSON object representing an example.
\`\`\`json
{"text": "The text content", "label": "The label"}
\`\`\`

### CSV
Should contain 'text' and 'label' columns.
\`\`\`csv
text,label
"The text content","The label"
\`\`\`

### Parquet
Should contain 'text' and 'label' columns.

### JSON
An array of dictionaries with 'text' and 'label' keys.
\`\`\`json
[{"text": "The text content", "label": "The label"}]
\`\`\`

### XML
Each 'record' element should contain 'text' and 'label' child elements.
\`\`\`xml
<record>
    <text>The text content</text>
    <label>The label</label>
</record>
\`\`\`

### YAML
Each document should be a dictionary with 'text' and 'label' keys.
\`\`\`yaml
- text: "The text content"
label: "The label"
\`\`\`

### TSV
Should contain 'text' and 'label' columns separated by tabs.

### Excel (.xls, .xlsx)
Should contain 'text' and 'label' columns.

### SQLite (.db)
Should contain a table with 'text' and 'label' columns.

### Feather
Should contain 'text' and 'label' columns.`,
    chat: `## Supported Data Formats and Structures:

### JSONL
Each line is a JSON object representing an example.
\`\`\`json
{"instruction": "The instruction", "output": "The output"}
\`\`\`

### CSV
Should contain 'instruction' and 'output' columns.
\`\`\`csv
instruction,output
"The instruction","The output"
\`\`\`

### Parquet
Should contain 'instruction' and 'output' columns.

### JSON
An array of dictionaries with 'instruction' and 'output' keys.
\`\`\`json
[{"instruction": "The instruction", "output": "The output"}]
\`\`\`

### XML
Each 'record' element should contain 'instruction' and 'output' child elements.
\`\`\`xml
<record>
    <instruction>The instruction</instruction>
    <output>The output</output>
</record>
\`\`\`

### YAML
Each document should be a dictionary with 'instruction' and 'output' keys.
\`\`\`yaml
- instruction: "The instruction"
  output: "The output"
\`\`\`

### TSV
Should contain 'instruction' and 'output' columns separated by tabs.

### Excel (.xls, .xlsx)
Should contain 'instruction' and 'output' columns.

### SQLite (.db)
Should contain a table with 'instruction' and 'output' columns.

### Feather
Should contain 'instruction' and 'output' columns.`,
    lm: `## Supported Data Formats and Structures:

### Dataset files saved by Hugging Face datasets library
The directory should contain 'dataset_info.json' and other related files.

### JSONL
Each line is a JSON object representing an example.
\`\`\`json
{"text": "The text content"}
\`\`\`

### CSV
Should contain 'text' column.
\`\`\`csv
text
"The text content"
\`\`\`

### Parquet
Should contain 'text' column.

### JSON
An array of dictionaries with 'text' key.
\`\`\`json
[{"text": "The text content"}]
\`\`\`

### XML
Each 'record' element should contain 'text' child element.
\`\`\`xml
<record>
    <text>The text content</text>
</record>
\`\`\`

### YAML
Each document should be a dictionary with 'text' key.
\`\`\`yaml
- text: "The text content"
\`\`\`

### TSV
Should contain 'text' column separated by tabs.

### Excel (.xls, .xlsx)
Should contain 'text' column.

### SQLite (.db)
Should contain a table with 'text' column.

### Feather
Should contain 'text' column.`,
    entity: `## Supported Data Formats and Structures:

### Hugging Face Dataset
Dataset files saved by the Hugging Face datasets library.

### JSONL
Each line is a JSON object representing an example.
\`\`\`json
{"tokens": ["token1", "token2", ...], "ner_tags": [0, 1, ...]}
\`\`\`

### CSV
Should contain 'tokens' and 'ner_tags' columns.
\`\`\`csv
tokens,ner_tags
"['token1', 'token2', ...]", "[0, 1, ...]"
\`\`\`

### Parquet
Should contain 'tokens' and 'ner_tags' columns.

### JSON
An array of dictionaries with 'tokens' and 'ner_tags' keys.
\`\`\`json
[{"tokens": ["token1", "token2", ...], "ner_tags": [0, 1, ...]}]
\`\`\`

### XML
Each 'record' element should contain 'tokens' and 'ner_tags' child elements.
\`\`\`xml
<record>
    <tokens>token1 token2 ...</tokens>
    <ner_tags>0 1 ...</ner_tags>
</record>
\`\`\`

### YAML
Each document should be a dictionary with 'tokens' and 'ner_tags' keys.
\`\`\`yaml
- tokens: ["token1", "token2", ...]
  ner_tags: [0, 1, ...]
\`\`\`

### TSV
Should contain 'tokens' and 'ner_tags' columns separated by tabs.

### Excel (.xls, .xlsx)
Should contain 'tokens' and 'ner_tags' columns.

### SQLite (.db)
Should contain a table with 'tokens' and 'ner_tags' columns.

### Feather
Should contain 'tokens' and 'ner_tags' columns.`,
    nli: `## Supported Data Formats and Structures:

### Hugging Face Dataset
Dataset files saved by the Hugging Face datasets library.

### JSONL
Each line is a JSON object representing an example.
\`\`\`json
{"premise": "The premise text", "hypothesis": "The hypothesis text", "label": 0 or 1 or 2}
\`\`\`

### CSV
Should contain 'premise', 'hypothesis', and 'label' columns.
\`\`\`csv
premise,hypothesis,label
"The premise text","The hypothesis text",0
\`\`\`

### Parquet
Should contain 'premise', 'hypothesis', and 'label' columns.

### JSON
An array of dictionaries with 'premise', 'hypothesis', and 'label' keys.
\`\`\`json
[{"premise": "The premise text", "hypothesis": "The hypothesis text", "label": 0}]
\`\`\`

### XML
Each 'record' element should contain 'premise', 'hypothesis', and 'label' child elements.
\`\`\`xml
<record>
    <premise>The premise text</premise>
    <hypothesis>The hypothesis text</hypothesis>
    <label>0</label>
</record>
\`\`\`

### YAML
Each document should be a dictionary with 'premise', 'hypothesis', and 'label' keys.
\`\`\`yaml
- premise: "The premise text"
  hypothesis: "The hypothesis text"
  label: 0
\`\`\`

### TSV
Should contain 'premise', 'hypothesis', and 'label' columns separated by tabs.

### Excel (.xls, .xlsx)
Should contain 'premise', 'hypothesis', and 'label' columns.

### SQLite (.db)
Should contain a table with 'premise', 'hypothesis', and 'label' columns.

### Feather
Should contain 'premise', 'hypothesis', and 'label' columns.`,
    txtqa: `## Supported Data Formats and Structures:

### JSONL
Each line is a JSON object representing an example.
\`\`\`json
{"context": "The context content", "question": "The question", "answers": {"answer_start": [int], "text": [str]}}
\`\`\`

### CSV
Should contain 'context', 'question', and 'answers' columns.
\`\`\`csv
context,question,answers
"The context content","The question","{'answer_start': [int], 'text': [str]}"
\`\`\`

### Parquet
Should contain 'context', 'question', and 'answers' columns.

### JSON
An array of dictionaries with 'context', 'question', and 'answers' keys.
\`\`\`json
[{"context": "The context content", "question": "The question", "answers": {"answer_start": [int], "text": [str]}}]
\`\`\`

### XML
Each 'record' element should contain 'context', 'question', and 'answers' child elements.
\`\`\`xml
<record>
    <context>The context content</context>
    <question>The question</question>
    <answers answer_start="int" text="str"></answers>
</record>
\`\`\`

### YAML
Each document should be a dictionary with 'context', 'question', and 'answers' keys.
\`\`\`yaml
- context: "The context content"
  question: "The question"
  answers:
    answer_start: [int]
    text: [str]
\`\`\`

### TSV
Should contain 'context', 'question', and 'answers' columns separated by tabs.

### Excel (.xls, .xlsx)
Should contain 'context', 'question', and 'answers' columns.

### SQLite (.db)
Should contain a table with 'context', 'question', and 'answers' columns.

### Feather
Should contain 'context', 'question', and 'answers' columns.`,
    trans: `## Supported Data Formats and Structures:

### JSONL
Each line is a JSON object representing an example.
\`\`\`json
{
    "translation": {
"en": "English text",
"fr": "French text"
    }
}
\`\`\`

### CSV
Should contain 'en' and 'fr' columns.
\`\`\`csv
en,fr
"English text","French text"
\`\`\`

### Parquet
Should contain 'en' and 'fr' columns.

### JSON
An array of dictionaries with 'en' and 'fr' keys.
\`\`\`json
[
    {
"en": "English text",
"fr": "French text"
    }
]
\`\`\`

### XML
Each 'record' element should contain 'en' and 'fr' child elements.
\`\`\`xml
<record>
    <en>English text</en>
    <fr>French text</fr>
</record>
\`\`\`

### YAML
Each document should be a dictionary with 'en' and 'fr' keys.
\`\`\`yaml
- en: "English text"
  fr: "French text"
\`\`\`

### TSV
Should contain 'en' and 'fr' columns separated by tabs.

### Excel (.xls, .xlsx)
Should contain 'en' and 'fr' columns.

### SQLite (.db)
Should contain a table with 'en' and 'fr' columns.

### Feather
Should contain 'en' and 'fr' columns.`,
    summz: `## Supported Data Formats and Structures:

### JSONL
Each line is a JSON object representing an example.
\`\`\`json
{"text": "The text content", "summary": "The summary"}
\`\`\`

### CSV
Should contain 'text' and 'summary' columns.
\`\`\`csv
text,summary
"The text content","The summary"
\`\`\`

### Parquet
Should contain 'text' and 'summary' columns.

### JSON
An array of dictionaries with 'text' and 'summary' keys.
\`\`\`json
[{"text": "The text content", "summary": "The summary"}]
\`\`\`

### XML
Each 'record' element should contain 'text' and 'summary' child elements.
\`\`\`xml
<record>
    <text>The text content</text>
    <summary>The summary</summary>
</record>
\`\`\`

### YAML
Each document should be a dictionary with 'text' and 'summary' keys.
\`\`\`yaml
- text: "The text content"
  summary: "The summary"
\`\`\`

### TSV
Should contain 'text' and 'summary' columns separated by tabs.

### Excel (.xls, .xlsx)
Should contain 'text' and 'summary' columns.

### SQLite (.db)
Should contain a table with 'text' and 'summary' columns.

### Feather
Should contain 'text' and 'summary' columns.`,
}
