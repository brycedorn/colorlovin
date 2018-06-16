import { action, http } from "@hyperapp/fx"
import fetch from 'unfetch'
import hex2rgb from 'hex2rgb'

const actions = {
  getPalette: () => state => [
    action('setColors', '...'),
    // action('setApiUrl', state.sourceUrl),
    http(
      `http://www.colourlovers.com/api/pattern/${state.sourceUrl.replace('http://www.colourlovers.com/palette/','').match(/([0-9])[^\/]*/)[0]}?format=json`,
      'paletteFetched'
    )
  ],
  setApiUrl: sourceUrl => state => {
    const baseUrl = 'http://www.colourlovers.com/palette/'
    const trimmedUrl = sourceUrl.replace(baseUrl,'')
    const paletteId = trimmedUrl.match(/([0-9])[^\/]*/)[0]

    return { 
      apiUrl: `http://www.colourlovers.com/api/pattern/${paletteId}?format=json`
    }
  },
  paletteFetched: ([{ colors, title }]) => [
    action('setColors', colors),
    action('setTitle', title),
    action('genOutput')
  ],
  setColors: colors => ({ colors }),
  setTitle: title => ({ title }),
  genOutput: () => (state, actions) => {
    const parsedColors = state.colors.map(toRGBA)
    const theme = {
      colors: { 
        toolbar: getRandomColor(parsedColors),
        toolbar_text: getRandomColor(parsedColors),
        accentcolor: getRandomColor(parsedColors),
        textcolor: getRandomColor(parsedColors),
        toolbar_field: getRandomColor(parsedColors),
        toolbar_field_text: getRandomColor(parsedColors),
        tab_line: getRandomColor(parsedColors) 
      },
      images: {
        additional_backgrounds: [ './bg-000.svg' ] 
      },
      title: state.title
    }

    window.JsonUrl('lzma').compress(theme).then(actions.setOutput)
  },
  setOutput: encodedTheme => ({ 
    outputUrl: `https://color.firefox.com/?theme=${encodedTheme}`
  }),
  input: ({ value }) => ({ sourceUrl: value }),
  copy: () => {
    const copyTextarea = document.querySelectorAll('input')[1]
    copyTextarea.focus()
    copyTextarea.select()

    document.execCommand('copy')

    return { copied: true }
  },
  resetCopytext: () => ({ copied: false }),
  remove: hex => [
    action('removeColor', hex),
    action('resetCopytext'),
    action('genOutput')
  ],
  removeColor: hex => state => ({
    colors: state.colors.filter(color => color !== hex)
  })
}

const toRGBA = hex => {
  const { rgb } = hex2rgb(hex)
  return { r: rgb[0], g: rgb[1], b: rgb[2], a: 1 }
}

const getRandomColor = colors => colors[Math.floor(Math.random() * colors.length)]

export default actions
