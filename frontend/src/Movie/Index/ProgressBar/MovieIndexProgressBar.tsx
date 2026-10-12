import React from 'react';
import { useSelector } from 'react-redux';
import ProgressBar from 'Components/ProgressBar';
import { sizes } from 'Helpers/Props';
import createMovieQueueItemsDetailsSelector, {
  MovieQueueDetails,
} from 'Movie/Index/createMovieQueueDetailsSelector';
import { MovieStatus } from 'Movie/Movie';
import { MovieFile } from 'MovieFile/MovieFile';
import getProgressBarKind from 'Utilities/Movie/getProgressBarKind';
import translate from 'Utilities/String/translate';
import getMovieStatusText, {
  shouldWrapMovieStatusText,
} from './getMovieStatusText';
import styles from './MovieIndexProgressBar.css';

interface MovieIndexProgressBarProps {
  movieId: number;
  movieFile?: MovieFile;
  monitored: boolean;
  status: MovieStatus;
  hasFile: boolean;
  isAvailable: boolean;
  width: number;
  detailedProgressBar: boolean;
  bottomRadius?: boolean;
  isStandAlone?: boolean;
  useTextStatus?: boolean;
}

function MovieIndexProgressBar({
  movieId,
  movieFile,
  monitored,
  status,
  hasFile,
  isAvailable,
  width,
  detailedProgressBar,
  bottomRadius,
  isStandAlone,
  useTextStatus = false,
}: MovieIndexProgressBarProps) {
  const queueDetails: MovieQueueDetails = useSelector(
    createMovieQueueItemsDetailsSelector(movieId)
  );

  const progress = 100;
  const queueStatusText =
    queueDetails.count > 0 ? translate('Downloading') : null;

  const statusText = getMovieStatusText(
    {
      hasFile,
      monitored,
      status,
    },
    {
      deleted: translate('Deleted'),
      downloaded: translate('Downloaded'),
      monitored: translate('Monitored'),
      unmonitored: translate('Unmonitored'),
    }
  );

  let movieStatus = translate('NotAvailable');
  if (hasFile) {
    movieStatus = movieFile?.quality?.quality.name ?? translate('Downloaded');
  } else if (status === 'deleted') {
    movieStatus = translate('Deleted');
  } else if (isAvailable && !hasFile) {
    movieStatus = translate('Missing');
  }

  const attachedClassName = bottomRadius
    ? styles.progressRadius
    : styles.progress;
  const containerClassName = isStandAlone ? undefined : attachedClassName;
  const progressBarKind = useTextStatus
    ? 'default'
    : getProgressBarKind(
        status,
        monitored,
        hasFile,
        isAvailable,
        queueDetails.count > 0
      );
  const wrapStatusText = useTextStatus && shouldWrapMovieStatusText(width);
  let progressBarSize: 'small' | 'medium' | 'large' = sizes.SMALL;
  if (useTextStatus || detailedProgressBar) {
    progressBarSize = sizes.MEDIUM;
  }

  if (wrapStatusText) {
    progressBarSize = sizes.LARGE;
  }
  const progressBarText = useTextStatus
    ? statusText
    : queueStatusText || movieStatus;

  return (
    <ProgressBar
      className={useTextStatus ? styles.textStatus : styles.progressBar}
      containerClassName={containerClassName}
      progress={progress}
      kind={progressBarKind}
      size={progressBarSize}
      showText={useTextStatus || detailedProgressBar}
      allowMultiline={wrapStatusText}
      width={width}
      text={progressBarText}
    />
  );
}

export default MovieIndexProgressBar;
