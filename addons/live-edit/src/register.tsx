import React from 'react';
import styled from '@emotion/styled';
// @ts-ignore
import { transform } from '@babel/standalone';

import { LiveProvider, LiveEditor } from 'react-live';

import { addons, types } from '@storybook/addons';
import { useChannel, useParameter } from '@storybook/api';
import { AddonPanel } from '@storybook/components';

import '@storybook/addon-notes/register';
import '@storybook/addon-knobs/register';
import '@storybook/addon-a11y/register';
import '@storybook/addon-viewport/register';
import dedent from 'ts-dedent';

const Wrapper = styled(AddonPanel)({
  background: '#1D1F21',
});

const Editor = () => {
  const emit = useChannel({});
  const initialCode: any = useParameter('editor') || '';

  return initialCode ? (
    <LiveProvider
      code={dedent(initialCode)}
      scope={{}}
      transformCode={input => {
        try {
          const output = transform(input, { presets: ['react'] }).code;

          emit('new-source', dedent(input));

          return output;
        } catch (e) {
          return input;
        }
      }}
    >
      <LiveEditor />
    </LiveProvider>
  ) : null;
};

addons.register('editor', () => {
  addons.add('editor', {
    type: types.PANEL,
    title: 'editor',
    render: ({ key, active }) => {
      return (
        // @ts-ignore
        <Wrapper active={active} key={key}>
          <Editor />
        </Wrapper>
      );
    },
  });
});
