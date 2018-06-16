import { app } from 'hyperapp'
import { withFx } from "@hyperapp/fx"

import state from './js/state.js'
import actions from './js/actions.js'
import view from './js/view.js'

const main = withFx(app)(state, actions, view, document.body);
