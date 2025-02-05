/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://doctor-chatbot-ai.vercel.app/',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    exclude: ['/admin', '/dashboard'],
};
