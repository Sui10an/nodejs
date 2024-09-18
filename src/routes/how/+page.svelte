<script lang="ts">
    import MarkdownIt from 'markdown-it'
    import md from '$lib/how.md?raw'
    import 'github-markdown-css'

    const render = new MarkdownIt()
    let content = render.render(md)

    const colors = {
        IMPORTANT: 'border-left: 4px solid #6e3bd4; color: #6e3bd4;',
        WARNING: '',
        INFO: ''
    }

    content = content.replace(/<blockquote>\n\<p>(.*?)\<\/p>\n<\/blockquote>/gs, (match, p1) => {
        const typeMatch = p1.match(/^\[!(IMPORTANT|WARNING|INFO)\](.*)$/s);
        if (typeMatch) {
            const type: 'IMPORTANT' | 'WARNING' | 'INFO' | null = typeMatch[1];
            if (!type) return match;
            const newContent = typeMatch[2].trim();
            const style = colors[type];
            return `<blockquote style="${style}">${newContent}</blockquote>`;
        }
        return match;
    });

    content = content.replace(/<h([1-2])>(.*?)\<\/h[1-2]>/gs, (match, p1, p2) => {
        return `<h${p1} id="${p2}">${p2}</h${p1}>`
    })
</script>

<article class="markdown-body p-10">
    {@html content}
</article>
