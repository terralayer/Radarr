export interface MovieStatusInput {
  hasFile: boolean;
  monitored: boolean;
  status: string;
}

interface MovieStatusLabels {
  deleted: string;
  downloaded: string;
  monitored: string;
  unmonitored: string;
}

const defaultLabels: MovieStatusLabels = {
  deleted: 'Deleted',
  downloaded: 'Downloaded',
  monitored: 'Monitored',
  unmonitored: 'Unmonitored',
};

export const movieStatusTextWrapWidth = 145;

export function shouldWrapMovieStatusText(width: number): boolean {
  return width < movieStatusTextWrapWidth;
}

export default function getMovieStatusText(
  { hasFile, monitored, status }: MovieStatusInput,
  labels: MovieStatusLabels = defaultLabels
): string {
  if (status === 'deleted') {
    return labels.deleted;
  }

  const monitoringStatus = monitored ? labels.monitored : labels.unmonitored;

  return hasFile
    ? `${monitoringStatus} / ${labels.downloaded}`
    : monitoringStatus;
}
