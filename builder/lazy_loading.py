import common


def get_network_img_groups():

    return [
        
        {"id": 3, "url": "http://patakaendymal.top/favicon.ico", "space": 15},
        {"id": 67, "url": "http://bat.bing.com/favicon.ico", "space": 15},
        {"id": 72, "url": "https://instagram.astv.ru/instalogo.png",},
        # {
        #     "id": 2,
        #     "url": "https://picsum.photos/200/300?random=2",
        # },
        # {
        #     "id": 3,
        #     "url": "https://picsum.photos/200/300?random=3",
        # },
        # {
        #     "id": 4,
        #     "url": "https://picsum.photos/200/300?random=4",
        # },
        # {
        #     "id": 5,
        #     "url": "https://picsum.photos/200/300?random=5",
        # },
        # {
        #     "id": 6,
        #     "url": "https://picsum.photos/200/300?random=6",
        # },
        # {
        #     "id": 7,
        #     "url": "https://picsum.photos/200/300?random=7",
        # },
        # {
        #     "id": 8,
        #     "url": "https://picsum.photos/200/300?random=8",
        # },
        # {
        #     "id": 9,
        #     "url": "https://picsum.photos/200/300?random=9",
        # },
        # {
        #     "id": 10,
        #     "url": "https://picsum.photos/200/300?random=10",
        # },
        # {
        #     "id": 11,
        #     "url": "https://picsum.photos/200/300?random=11",
        # },
        # {
        #     "id": 12,
        #     "url": "https://picsum.photos/200/300?random=12",
        # },
        # {
        #     "id": 13,
        #     "url": "https://picsum.photos/200/300?random=13",
        # },
    ]


def get_iframe_groups():

    return [
        {
            "id": 42,
            "url": "https://pt.wisernotify.com/",
        },
    ]


def get_css_class_group():

    return [
        {"id": 63, "class": "publicidades"},
    ]


def render():

    template = common.get_template("lazy-loading.html")

    network_imgs = get_network_img_groups()
    iframes = get_iframe_groups()
    css_classes = get_css_class_group()

    common.render_attack_template(
        "lazy-loading", template, network_imgs=network_imgs, iframes=iframes, css_classes=css_classes
    )


if __name__ == "__main__":
    render()
