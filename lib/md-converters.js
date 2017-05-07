'use strict'

module.exports = [
  // P标签处理
  {
    filter: 'p',
    replacement: function (content, node) {
      var attrClass = node.getAttribute('class') || ''

      if (attrClass === 'command') {
        if (!content.endsWith('\n')) {
          content += '\n'
        }
        return '\n```\n' + content + '```\n'
      } else {
        return '\n\n' + content + '\n\n'
      }


    }
  },
  // BR 标签处理
  {
    filter: 'br',
    replacement: function () {
      return '  \n'
    }
  },
  // H1 处理
  {
    filter: 'h1',
    replacement: function (content, node) {
      return content + '\n' + '='.repeat(60)
    }
  },
  // H2-H6 标签处理
  {
    filter: ['h2', 'h3', 'h4', 'h5', 'h6'],
    replacement: function (content, node) {
      var hLevel = node.nodeName.charAt(1)
      var hPrefix = '###'
      hLevel = hLevel - 3
      for (var i = 0; i < hLevel; i++) {
        hPrefix += '#'
      }
      return '\n\n' + hPrefix + ' ' + content + '\n\n'
    }
  },
  // HR 标签处理
  {
    filter: 'hr',
    replacement: function () {
      return '\n\n* * *\n\n'
    }
  },
  // em i 斜体处理
  {
    filter: ['em', 'i'],
    replacement: function (content) {
      return ' _' + content + '_ '
    }
  },
  // Strong b 粗体处理
  {
    filter: ['strong', 'b'],
    replacement: function (content) {
      return '**' + content + '**'
    }
  },
  // Inline code
  {
    filter: function (node) {
      var hasSiblings = node.previousSibling || node.nextSibling
      var isCodeBlock = node.parentNode.nodeName === 'PRE' && !hasSiblings

      return node.nodeName === 'CODE' && !isCodeBlock
    },
    replacement: function (content) {
      return '`' + content + '`'
    }
  },
  // A 标签处理
  {
    filter: function (node) {
      return node.nodeName === 'A' && node.getAttribute('href')
    },
    replacement: function (content, node) {
      var titlePart = node.title ? ' "' + node.title + '"' : ''
      return '[' + content + '](' + node.getAttribute('href') + titlePart + ')'
    }
  },
  // 特殊情况下的A标签处理
  {
    filter: function (node) {
      return node.nodeName === 'A' && node.getAttribute('style')
    },
    replacement: function (content, node) {
      return content
    }
  },
  // IMG 标签处理
  {
    filter: 'img',
    replacement: function (content, node) {
      var alt = node.alt || ''
      var src = node.getAttribute('src') || ''
      var title = node.title || ''
      var titlePart = title ? ' "' + title + '"' : ''
      return src ? '\n![' + alt + ']' + '(' + src + titlePart + ')\n' : ''
    }
  },
  // 代码块处理
  {
    filter: 'pre',
    replacement: function (content, node) {
      let contentText = node.innerText
      if (!contentText.endsWith('\n')) {
        contentText += '\n'
      }
      return '\n```\n' + contentText + '```\n'
    }
  },
  // 行内代码处理
  {
    filter: 'code',
    replacement: function (content, node) {
      return '`' + content + '`'
    }
  },
  // div 处理
  {
    filter: 'div',
    replacement: function (content, node) {
      var attrClass = node.getAttribute('class') || ''
      if (attrClass === 'code') {
        if (!content.endsWith('\n')) {
          content += '\n'
        }
        return '\n```\n' + content + '```\n'
      } else {
        return content
      }
    }
  },
  // 直接返回内容的标签
  {
    filter: ['figure', 'span', 'small', 'section', 'font', 'asymspc', 'button', 'article', 'figcaption'],
    replacement: function (content) {
      return content
    }
  },
  // 引用
  {
    filter: 'blockquote',
    replacement: function (content) {
      content = content.trim()
      content = content.replace(/\n{3,}/g, '\n\n')
      content = content.replace(/^/gm, '> ')
      return '\n\n' + content + '\n\n'
    }
  },
  // 列表项
  {
    filter: 'li',
    replacement: function (content, node) {
      content = content.replace(/^\s+/, '').replace(/\n/gm, '\n    ')
      var prefix = '*   '
      var parent = node.parentNode
      var index = Array.prototype.indexOf.call(parent.children, node) + 1

      prefix = /ol/i.test(parent.nodeName) ? index + '.  ' : '*   '
      return prefix + content + '\n'
    }
  },
  // 有序／无序列表
  {
    filter: ['ul', 'ol'],
    replacement: function (content, node) {
      var strings = []
      for (var i = 0; i < node.childNodes.length; i++) {
        strings.push(node.childNodes[i]._replacement)
      }

      if (/li/i.test(node.parentNode.nodeName)) {
        return '\n' + strings.join('\n')
      }
      return '\n\n' + strings.join('\n') + '\n\n'
    }
  },
  // 判断是否是block，如果是block，前后加空行
  {
    filter: function (node) {
      return this.isBlock(node)
    },
    replacement: function (content, node) {
      return '\n\n' + this.outer(node, content) + '\n\n'
    }
  },

  // Anything else!
  {
    filter: function () {
      return true
    },
    replacement: function (content, node) {
      return this.outer(node, content)
    }
  }
]
