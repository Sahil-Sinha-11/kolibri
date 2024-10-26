import {
  getAbsoluteFilePath,
  getCSSPaths,
  replaceCSSPaths,
  getDOMPaths,
  replaceDOMPaths,
} from '../src/fileUtils';

describe('File Path replacement', () => {
  describe('Absolute path resolution', () => {
    it('should resolve a simple relative path', () => {
      expect(getAbsoluteFilePath('package/test.css', './test.woff')).toEqual('package/test.woff');
    });
    it('should resolve a more complex relative path', () => {
      expect(getAbsoluteFilePath('package/css/test.css', '../fonts/test.woff')).toEqual(
        'package/fonts/test.woff',
      );
    });
    it('should handle a path with a space in it', () => {
      expect(getAbsoluteFilePath('test.htm', 'Basic Book.css')).toEqual('Basic Book.css');
    });
  });
  describe('CSS path finding', () => {
    it('should find a simple relative path', () => {
      const packageFiles = ['./test.woff'];
      expect(getCSSPaths('url("./test.woff")')).toEqual(packageFiles);
    });
    it('should find a more complex relative path', () => {
      const packageFiles = ['../fonts/test.woff'];
      expect(getCSSPaths('url("../fonts/test.woff")')).toEqual(packageFiles);
    });
    it('should find a more complex relative path with query parameters', () => {
      const packageFiles = ['../fonts/test.woff'];
      expect(getCSSPaths('url("../fonts/test.woff?iefix")')).toEqual(packageFiles);
    });
    it('should find a path with a space', () => {
      const packageFiles = ['../fonts/test this.woff'];
      expect(getCSSPaths('url("../fonts/test this.woff?iefix")')).toEqual(packageFiles);
    });
    it('should find a path with an encoded space', () => {
      const packageFiles = ['../fonts/test this.woff'];
      expect(getCSSPaths('url("../fonts/test%20this.woff?iefix")')).toEqual(packageFiles);
    });
    it('should find paths that use single quotes', () => {
      const packageFiles = ['../fonts/test.woff'];
      expect(getCSSPaths("url('../fonts/test.woff')")).toEqual(packageFiles);
    });
    it('should find paths that use single quotes with query parameters', () => {
      const packageFiles = ['../fonts/test.woff'];
      expect(getCSSPaths("url('../fonts/test.woff?iefix')")).toEqual(packageFiles);
    });
    it('should find paths that use no quotes', () => {
      const packageFiles = ['../fonts/test.woff'];
      expect(getCSSPaths('url(../fonts/test.woff)')).toEqual(packageFiles);
    });
    it('should find paths with no quotes with query parameters', () => {
      const packageFiles = ['../fonts/test.woff'];
      expect(getCSSPaths('url(../fonts/test.woff?iefix)')).toEqual(packageFiles);
    });
  });
  describe('CSS path replacement', () => {
    it('should replace a simple relative path', () => {
      const packageFiles = {
        './test.woff': 'different',
      };
      expect(replaceCSSPaths('url("./test.woff")', packageFiles)).toEqual('url("different")');
    });
    it('should replace a more complex relative path', () => {
      const packageFiles = {
        '../fonts/test.woff': 'different',
      };
      expect(replaceCSSPaths('url("../fonts/test.woff")', packageFiles)).toEqual(
        'url("different")',
      );
    });
    it('should replace a path with a space', () => {
      const packageFiles = {
        '../fonts/test this.woff': 'different',
      };
      expect(replaceCSSPaths('url("../fonts/test this.woff")', packageFiles)).toEqual(
        'url("different")',
      );
    });
    it('should replace a path with an encoded space', () => {
      const packageFiles = {
        '../fonts/test this.woff': 'different',
      };
      expect(replaceCSSPaths('url("../fonts/test%20this.woff")', packageFiles)).toEqual(
        'url("different")',
      );
    });
    it('should replace paths that use single quotes', () => {
      const packageFiles = {
        '../fonts/test.woff': 'different',
      };
      expect(replaceCSSPaths("url('../fonts/test.woff')", packageFiles)).toEqual(
        "url('different')",
      );
    });
    it('should replace paths that use no quotes', () => {
      const packageFiles = {
        '../fonts/test.woff': 'different',
      };
      expect(replaceCSSPaths('url(../fonts/test.woff)', packageFiles)).toEqual('url(different)');
    });
    it('should replace paths that use query parameters', () => {
      const packageFiles = {
        '../fonts/test.woff': 'different',
      };
      expect(replaceCSSPaths('url(../fonts/test.woff?iefix)', packageFiles)).toEqual(
        'url(different)',
      );
    });
    it('should not replace urls that are not a registered path', () => {
      const packageFiles = {
        '../../../../audio/test.mp3': 'different',
      };
      expect(replaceCSSPaths('url(../../../../fonts/test.woff)', packageFiles)).toEqual(
        'url(../../../../fonts/test.woff)',
      );
    });
    it('should not replace urls that are not a valid path', () => {
      // This is mostly to make sure the function does not error.
      const packageFiles = {
        'package/audio/test.mp3': 'different',
      };
      expect(replaceCSSPaths('url(flob a dob dib dob)', packageFiles)).toEqual(
        'url(flob a dob dib dob)',
      );
    });
  });
  const htmlTemplate = (attr, value) =>
    `<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body><img ${attr}="${value}" /></body></html>`;
  describe.each(['href', 'src'])('HTML path finding for %s', attr => {
    const mimeType = 'text/html';
    it('should find a simple relative path', () => {
      const packageFiles = ['./test.png'];
      expect(getDOMPaths(htmlTemplate(attr, './test.png'), mimeType)).toEqual(packageFiles);
    });
    it('should find a more complex relative path', () => {
      const packageFiles = ['../fonts/test.png'];
      expect(getDOMPaths(htmlTemplate(attr, '../fonts/test.png'), mimeType)).toEqual(packageFiles);
    });
    it('should find a path with a space', () => {
      const packageFiles = ['../fonts/test this.png'];
      expect(getDOMPaths(htmlTemplate(attr, '../fonts/test this.png'), mimeType)).toEqual(
        packageFiles,
      );
    });
    it('should find a path with an encoded space', () => {
      const packageFiles = ['../fonts/test this.png'];
      expect(getDOMPaths(htmlTemplate(attr, '../fonts/test%20this.png'), mimeType)).toEqual(
        packageFiles,
      );
    });
    it('should find a more complex relative path with query parameters', () => {
      const packageFiles = ['../fonts/test.png'];
      expect(getDOMPaths(htmlTemplate(attr, '../fonts/test.png?iefix'), mimeType)).toEqual(
        packageFiles,
      );
    });
  });
  const inlineCSSHtmlTemplate = value =>
    `<html xmlns="http://www.w3.org/1999/xhtml"><head><style>background: url('${value}');</style></head><body></body></html>`;
  describe('Inline CSS path finding', () => {
    const mimeType = 'text/html';
    it('should find a simple relative path', () => {
      const packageFiles = ['./test.png'];
      expect(getDOMPaths(inlineCSSHtmlTemplate('./test.png'), mimeType)).toEqual(packageFiles);
    });
    it('should find a more complex relative path', () => {
      const packageFiles = ['../fonts/test.png'];
      expect(getDOMPaths(inlineCSSHtmlTemplate('../fonts/test.png'), mimeType)).toEqual(
        packageFiles,
      );
    });
    it('should find a path with a space', () => {
      const packageFiles = ['../fonts/test this.png'];
      expect(getDOMPaths(inlineCSSHtmlTemplate('../fonts/test this.png'), mimeType)).toEqual(
        packageFiles,
      );
    });
    it('should find a path with an encoded space', () => {
      const packageFiles = ['../fonts/test this.png'];
      expect(getDOMPaths(inlineCSSHtmlTemplate('../fonts/test%20this.png'), mimeType)).toEqual(
        packageFiles,
      );
    });
    it('should find a more complex relative path with query parameters', () => {
      const packageFiles = ['../fonts/test.png'];
      expect(getDOMPaths(inlineCSSHtmlTemplate('../fonts/test.png?iefix'), mimeType)).toEqual(
        packageFiles,
      );
    });
  });
  describe.each(['href', 'src'])('HTML path replacement for %s', attr => {
    const mimeType = 'text/html';
    it('should replace a simple relative path', () => {
      const packageFiles = {
        './test.png': 'different',
      };
      expect(replaceDOMPaths(htmlTemplate(attr, './test.png'), packageFiles, mimeType)).toEqual(
        htmlTemplate(attr, 'different'),
      );
    });
    it('should replace a more complex relative path', () => {
      const packageFiles = {
        '../fonts/test.png': 'different',
      };
      expect(
        replaceDOMPaths(htmlTemplate(attr, '../fonts/test.png'), packageFiles, mimeType),
      ).toEqual(htmlTemplate(attr, 'different'));
    });
    it('should replace a path with a space', () => {
      const packageFiles = {
        '../fonts/test this.png': 'different',
      };
      expect(
        replaceDOMPaths(htmlTemplate(attr, '../fonts/test this.png'), packageFiles, mimeType),
      ).toEqual(htmlTemplate(attr, 'different'));
    });
    it('should replace a path with an encoded space', () => {
      const packageFiles = {
        '../fonts/test this.png': 'different',
      };
      expect(
        replaceDOMPaths(htmlTemplate(attr, '../fonts/test%20this.png'), packageFiles, mimeType),
      ).toEqual(htmlTemplate(attr, 'different'));
    });
    it('should replace paths with query parameters', () => {
      const packageFiles = {
        '../fonts/test.png': 'different',
      };
      expect(
        replaceDOMPaths(htmlTemplate(attr, '../fonts/test.png?iefix'), packageFiles, mimeType),
      ).toEqual(htmlTemplate(attr, 'different'));
    });
  });
  const xmlTemplate = (attr, value) =>
    `<tt xmlns="http://www.w3.org/ns/ttml" xml:lang="en"><body><div><img ${attr}="${value}"/></div></body></tt>`;
  describe.each(['href', 'src'])('XML path finding for %s', attr => {
    const mimeType = 'text/xml';
    it('should find a simple relative path', () => {
      const packageFiles = ['./test.png'];
      expect(getDOMPaths(xmlTemplate(attr, './test.png'), mimeType)).toEqual(packageFiles);
    });
    it('should find a more complex relative path', () => {
      const packageFiles = ['../fonts/test.png'];
      expect(getDOMPaths(xmlTemplate(attr, '../fonts/test.png'), mimeType)).toEqual(packageFiles);
    });
    it('should find a path with a space', () => {
      const packageFiles = ['../fonts/test this.png'];
      expect(getDOMPaths(xmlTemplate(attr, '../fonts/test this.png'), mimeType)).toEqual(
        packageFiles,
      );
    });
    it('should find a path with an encoded space', () => {
      const packageFiles = ['../fonts/test this.png'];
      expect(getDOMPaths(xmlTemplate(attr, '../fonts/test%20this.png'), mimeType)).toEqual(
        packageFiles,
      );
    });
    it('should find a more complex relative path with query parameters', () => {
      const packageFiles = ['../fonts/test.png'];
      expect(getDOMPaths(xmlTemplate(attr, '../fonts/test.png?iefix'), mimeType)).toEqual(
        packageFiles,
      );
    });
  });
  const styleBlockHtmlTemplate = cssContent =>
    `<html xmlns="http://www.w3.org/1999/xhtml"><head><style>${cssContent}</style></head><body></body></html>`;

  const multipleStyleBlockTemplate = (cssContent1, cssContent2) =>
    `<html xmlns="http://www.w3.org/1999/xhtml"><head><style>${cssContent1}</style><style>${cssContent2}</style></head><body></body></html>`;

  describe('Style block path replacement', () => {
    const mimeType = 'text/html';

    it('should replace a simple relative path in style block', () => {
      const packageFiles = {
        './test.png': 'different',
      };
      const input = styleBlockHtmlTemplate('background: url("./test.png");');
      const expected = styleBlockHtmlTemplate('background: url("different");');
      expect(replaceDOMPaths(input, packageFiles, mimeType)).toEqual(expected);
    });

    it('should replace multiple paths in single style block', () => {
      const packageFiles = {
        './bg.png': 'new-bg',
        './logo.svg': 'new-logo',
      };
      const input = styleBlockHtmlTemplate(
        'background: url("./bg.png"); .logo { background-image: url("./logo.svg"); }',
      );
      const expected = styleBlockHtmlTemplate(
        'background: url("new-bg"); .logo { background-image: url("new-logo"); }',
      );
      expect(replaceDOMPaths(input, packageFiles, mimeType)).toEqual(expected);
    });

    it('should replace paths in multiple style blocks', () => {
      const packageFiles = {
        './bg.png': 'new-bg',
        './logo.svg': 'new-logo',
      };
      const input = multipleStyleBlockTemplate(
        'background: url("./bg.png");',
        '.logo { background-image: url("./logo.svg"); }',
      );
      const expected = multipleStyleBlockTemplate(
        'background: url("new-bg");',
        '.logo { background-image: url("new-logo"); }',
      );
      expect(replaceDOMPaths(input, packageFiles, mimeType)).toEqual(expected);
    });

    it('should handle paths with spaces in style blocks', () => {
      const packageFiles = {
        './my image.png': 'new-image',
      };
      const input = styleBlockHtmlTemplate('background: url("./my image.png");');
      const expected = styleBlockHtmlTemplate('background: url("new-image");');
      expect(replaceDOMPaths(input, packageFiles, mimeType)).toEqual(expected);
    });

    it('should handle encoded paths in style blocks', () => {
      const packageFiles = {
        './my image.png': 'new-image',
      };
      const input = styleBlockHtmlTemplate('background: url("./my%20image.png");');
      const expected = styleBlockHtmlTemplate('background: url("new-image");');
      expect(replaceDOMPaths(input, packageFiles, mimeType)).toEqual(expected);
    });

    it('should handle paths with query parameters in style blocks', () => {
      const packageFiles = {
        './test.png': 'new-image',
      };
      const input = styleBlockHtmlTemplate('background: url("./test.png?v=123");');
      const expected = styleBlockHtmlTemplate('background: url("new-image");');
      expect(replaceDOMPaths(input, packageFiles, mimeType)).toEqual(expected);
    });

    it('should not replace unregistered paths in style blocks', () => {
      const packageFiles = {
        './registered.png': 'new-image',
      };
      const css = 'background: url("./unregistered.png");';
      const input = styleBlockHtmlTemplate(css);
      const expected = styleBlockHtmlTemplate(css);
      expect(replaceDOMPaths(input, packageFiles, mimeType)).toEqual(expected);
    });

    const createMixedContentHtml = ({ bgUrl, logoUrl, iconUrl }) =>
      `<html xmlns="http://www.w3.org/1999/xhtml"><head><style>body { background: url("${bgUrl}"); } .logo { background-image: url("${logoUrl}"); }</style></head><body><img src="${iconUrl}" style="background: url('${bgUrl}');" /></body></html>`;

    it('should handle mixed content with style blocks and attributes', () => {
      const packageFiles = {
        './bg.png': 'new-bg',
        './logo.svg': 'new-logo',
        './icon.png': 'new-icon',
      };

      const input = createMixedContentHtml({
        bgUrl: './bg.png',
        logoUrl: './logo.svg',
        iconUrl: './icon.png',
      });

      const expected = createMixedContentHtml({
        bgUrl: 'new-bg',
        logoUrl: 'new-logo',
        iconUrl: 'new-icon',
      });

      expect(replaceDOMPaths(input, packageFiles, mimeType)).toEqual(expected);
    });
  });

  describe('Style block XML path replacement', () => {
    const mimeType = 'text/xml';

    it('should replace paths in XML style blocks', () => {
      const packageFiles = {
        './test.png': 'different',
      };
      const input = `
        <tt xmlns="http://www.w3.org/ns/ttml" xml:lang="en">
          <head>
            <styling>
              <style>background: url("./test.png");</style>
            </styling>
          </head>
        </tt>`.trim();
      const expected = `
        <tt xmlns="http://www.w3.org/ns/ttml" xml:lang="en">
          <head>
            <styling>
              <style>background: url("different");</style>
            </styling>
          </head>
        </tt>`.trim();
      expect(replaceDOMPaths(input, packageFiles, mimeType)).toEqual(expected);
    });
  });
  describe.each(['href', 'src'])('XML path replacement for %s', attr => {
    const mimeType = 'text/xml';
    it('should replace a simple relative path', () => {
      const packageFiles = {
        './test.png': 'different',
      };
      expect(replaceDOMPaths(xmlTemplate(attr, './test.png'), packageFiles, mimeType)).toEqual(
        xmlTemplate(attr, 'different'),
      );
    });
    it('should replace a more complex relative path', () => {
      const packageFiles = {
        '../fonts/test.png': 'different',
      };
      expect(
        replaceDOMPaths(xmlTemplate(attr, '../fonts/test.png'), packageFiles, mimeType),
      ).toEqual(xmlTemplate(attr, 'different'));
    });
    it('should replace a path with a space', () => {
      const packageFiles = {
        '../fonts/test this.png': 'different',
      };
      expect(
        replaceDOMPaths(xmlTemplate(attr, '../fonts/test this.png'), packageFiles, mimeType),
      ).toEqual(xmlTemplate(attr, 'different'));
    });
    it('should replace a path with an encoded space', () => {
      const packageFiles = {
        '../fonts/test this.png': 'different',
      };
      expect(
        replaceDOMPaths(xmlTemplate(attr, '../fonts/test%20this.png'), packageFiles, mimeType),
      ).toEqual(xmlTemplate(attr, 'different'));
    });
    it('should replace paths with query parameters', () => {
      const packageFiles = {
        '../fonts/test.png': 'different',
      };
      expect(
        replaceDOMPaths(xmlTemplate(attr, '../fonts/test.png?iefix'), packageFiles, mimeType),
      ).toEqual(xmlTemplate(attr, 'different'));
    });
  });
});
