const baseSiteConfig = {
    name: "X Cards",
    description:
        "Share X anywhere, any format. A Chrome extension for easy access to X posts in multiple formats.",
    url: "https://x-cards.net",
    keywords: [
        "X.com",
        "Twitter",
        "Chrome Extension",
        "Social Media",
        "Content Sharing",
        "Card Generator",
        "Export Tools",
        "JSON",
        "Markdown",
        "PNG",
        "JPEG",
        "SVG",
    ],
    authors: [
        {
            name: "hzeyuan",
            url: "https://github.com/hzeyuan",
        }
    ],
    creator: '@Zane Ryan',
    themeColor: '#fff',
    icons: {
        icon: "https://x-cards.net/xcards/favicon/favicon.ico",
        android: "https://x-cards.net/xcards/favicon/android-chrome-192x192.png",
        shortcut: "https://x-cards.net/xcards/favicon/favicon.ico",
        apple: "https://x-cards.net/xcards/favicon/apple-touch-icon.png",
    },
    ogImage: "https://x-cards.net/xcards/favicon/assets/v0.02-demo.jpg",
    links: {
        github: "https://github.com/hzeyuan/x-cards",
    },
}

export const siteConfig = {
    ...baseSiteConfig,
    openGraph: {
        type: "website",
        locale: "en_US",
        url: baseSiteConfig.url,
        title: baseSiteConfig.name,
        description: baseSiteConfig.description,
        siteName: baseSiteConfig.name,
    },
    twitter: {
        card: "summary_large_image",
        title: baseSiteConfig.name,
        description: baseSiteConfig.description,
        images: [`${baseSiteConfig.url}/xcards/favicon/x-cards-og.png`],
        creator: baseSiteConfig.creator,
    },
}