import assert from 'node:assert/strict';
import test from 'node:test';

interface MovieStatusInput {
  hasFile: boolean;
  isDownloading?: boolean;
  monitored: boolean;
  status: string;
}

type GetMovieStatusText = (input: MovieStatusInput) => string;

type ShouldWrapMovieStatusText = (width: number) => boolean;

async function loadMovieStatusTextHelpers(): Promise<{
  getMovieStatusText?: GetMovieStatusText;
  shouldWrapMovieStatusText?: ShouldWrapMovieStatusText;
}> {
  try {
    const module = await import(
      '../frontend/src/Movie/Index/ProgressBar/getMovieStatusText.ts'
    );

    return {
      getMovieStatusText: module.default,
      shouldWrapMovieStatusText: module.shouldWrapMovieStatusText,
    };
  } catch {
    return {};
  }
}

test('uses text that describes both monitoring and imported-file status', async () => {
  const { getMovieStatusText, shouldWrapMovieStatusText } =
    await loadMovieStatusTextHelpers();

  assert.ok(getMovieStatusText, 'movie status text is available');

  assert.equal(
    getMovieStatusText({
      hasFile: false,
      monitored: true,
      status: 'released',
    }),
    'Monitored'
  );
  assert.equal(
    getMovieStatusText({
      hasFile: true,
      monitored: true,
      status: 'released',
    }),
    'Monitored / Downloaded'
  );
  assert.equal(
    getMovieStatusText({
      hasFile: true,
      monitored: false,
      status: 'released',
    }),
    'Unmonitored / Downloaded'
  );
  assert.equal(
    getMovieStatusText({
      hasFile: false,
      monitored: false,
      status: 'released',
    }),
    'Unmonitored'
  );
  assert.equal(
    getMovieStatusText({
      hasFile: true,
      monitored: true,
      status: 'deleted',
    }),
    'Deleted'
  );
  assert.equal(
    getMovieStatusText({
      hasFile: true,
      isDownloading: true,
      monitored: true,
      status: 'released',
    }),
    'Monitored / Downloaded'
  );
  assert.ok(
    shouldWrapMovieStatusText,
    'small poster labels can use a readable second line'
  );
  assert.equal(shouldWrapMovieStatusText(67), true);
  assert.equal(shouldWrapMovieStatusText(145), false);
});
