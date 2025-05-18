const mockOpenAI = jest.fn().mockImplementation(() => {
  return {
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: 'Team Player',
                role: 'assistant',
              },
              index: 0,
              finish_reason: 'stop',
            },
          ],
        }),
      },
    },
  };
});

export default mockOpenAI; 