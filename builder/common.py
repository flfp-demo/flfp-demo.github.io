import os
import sys
from pathlib import Path
from jinja2 import Environment, PackageLoader, select_autoescape

__dir__ = Path(os.path.dirname(os.path.abspath(__file__)))

output_dir = __dir__ / "../public"

env = Environment(loader=PackageLoader("common"), autoescape=select_autoescape())


def get_template(template_name):

    return env.get_template(template_name)


def render_attack_template(attack_name, template, **kwargs):

    rendered = template.render(attack_name=attack_name, **kwargs)
    
    os.makedirs(output_dir / f"attacks/{attack_name}", exist_ok=True)

    with open(output_dir / f"attacks/{attack_name}/index.html", "w", encoding="utf-8") as f:
        f.write(rendered)
        
    # copy the service worker to the same directory
    os.system(f"cp {__dir__}/services/{attack_name}.js {output_dir}/attacks/{attack_name}/service-worker.js")
