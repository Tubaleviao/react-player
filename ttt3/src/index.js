import React from 'react';
import {render} from 'react-dom';
import Player from './player'

let songs = [{title:"ho"},
			{title:"ha"},
			{title:"he"},
			{title:"hi"}]

render(
  <Player songs={songs} />,
  document.getElementById('root')
);