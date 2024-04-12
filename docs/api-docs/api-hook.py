import logging, re, yaml
import mkdocs.plugins

regex = re.compile(r'<api>([\s\S]*?)<\/api>', re.MULTILINE)

def get_http_response_name(code):
    code = str(code)
    codes = {
        "200": "OK",
        "201": "Created",
        "204": "No Content",
        "400": "Bad Request",
        "401": "Unauthorized",
        "403": "Forbidden",
        "404": "Not Found",
        "500": "Internal Server Error"
    }
    
    if code in codes:
        return codes[code]
    else:
        return None


def table(dict):
  builder = ""
  builder += "| Field | Description | Example |\n|--|--|--|\n"
  for k, v in dict.items():
    [description, example] = v.split('|')
    builder += f"| `{k}` | {description} | {example} |\n"

  return builder + "\n"

def generateHtml(content):
    desc = yaml.safe_load(content)
    builder = ""
    builder += "<hr>"
    builder += "<div markdown=\"1\" class=\"api-heading\">\n"
    builder += f"## {desc['name']}\n\n"

    if "locked" in desc and desc["locked"]:
        builder += ':octicons-lock-16: *endpoint requires [login](/api/user/#verify-user).*'

    builder += '</div>\n'

    builder += f"```\n{desc['path']}\n```\n"

    if "text" in desc:
        builder += f"{desc['text']}\n"
    
    if "body" in desc:
        builder += "=== \"Request body\"\n"

        if "type" in desc["body"]:
            builder += f"*type:* `{desc['body']['type']}`\n\n"
        
        if "text" in desc["body"]:
            builder += f"{desc['body']['text']}\n"
        
        if "parameters" in desc["body"]:
            builder += table(desc["body"]["parameters"])
    
    if "path-params" in desc:
        builder += "=== \"Path parameters\"\n"
        
        if "text" in desc["path-params"]:
            builder += f"{desc['path-params']['text']}\n"
        
        if "parameters" in desc["path-params"]:
            builder += table(desc["path-params"]["parameters"])
    
    if "query-params" in desc:
        builder += "=== \"Query parameters\"\n"
        
        if "text" in desc["query-params"]:
            builder += f"{desc['query-params']['text']}\n"
        
        if "parameters" in desc["query-params"]:
            builder += table(desc["query-params"]["parameters"])

    if "examples" in desc:
        for e in desc["examples"]:
            code = e['name']
            name = get_http_response_name(code)
            full_name = f"{code} - {name}" if name else code
            builder += f"<details class=\"example\" markdown=\"1\"><summary><strong>Example</strong> <code>{full_name}</code></summary>\n"
            builder += f"```\n{e['request']}\n```\n\n"
            builder += f"**Response** _type_: `{e['response']['content-type']}`\n"
            builder += f"```\n{e['response']['body']}\n```\n"
            builder += "</details>\n\n"

    return builder

@mkdocs.plugins.event_priority(-10000)
def on_page_markdown(markdown, page, **kwargs):
    return regex.sub(lambda x: generateHtml(x.group(1)), markdown)