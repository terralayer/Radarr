using System.Collections.Generic;
using Moq;
using NUnit.Framework;
using NzbDrone.Core.Configuration;
using NzbDrone.Core.Download;
using NzbDrone.Core.Download.TrackedDownloads;
using NzbDrone.Core.Messaging.Events;
using NzbDrone.Core.Movies;
using NzbDrone.Core.Parser.Model;
using NzbDrone.Core.Test.Framework;
using NzbDrone.Test.Common;

namespace NzbDrone.Core.Test.Download
{
    [TestFixture]
    public class DownloadProcessingServiceFixture : CoreTest<DownloadProcessingService>
    {
        private TrackedDownload _completedDownload;

        [SetUp]
        public void Setup()
        {
            _completedDownload = new TrackedDownload
            {
                IsTrackable = true,
                State = TrackedDownloadState.ImportBlocked,
                RemoteMovie = new RemoteMovie
                {
                    Movie = new Movie()
                },
                DownloadItem = new DownloadClientItem
                {
                    DownloadId = "completed-download",
                    Status = DownloadItemStatus.Completed
                }
            };

            Mocker.GetMock<IConfigService>()
                  .SetupGet(v => v.EnableCompletedDownloadHandling)
                  .Returns(true);

            Mocker.GetMock<ITrackedDownloadService>()
                  .Setup(v => v.GetTrackedDownloads())
                  .Returns(new List<TrackedDownload> { _completedDownload });
        }

        [Test]
        public void should_rescan_a_completed_trackable_download_using_the_completed_download_service()
        {
            Subject.Execute(new ProcessMonitoredDownloadsCommand
            {
                RescanCompletedDownloads = true
            });

            Mocker.GetMock<ICompletedDownloadService>()
                  .Verify(v => v.Import(_completedDownload), Times.Once());
        }

        [Test]
        public void should_not_rescan_a_completed_ignored_download()
        {
            _completedDownload.State = TrackedDownloadState.Ignored;

            Subject.Execute(new ProcessMonitoredDownloadsCommand
            {
                RescanCompletedDownloads = true
            });

            Mocker.GetMock<ICompletedDownloadService>()
                  .Verify(v => v.Import(It.IsAny<TrackedDownload>()), Times.Never());
        }

        [Test]
        public void should_not_rescan_a_completed_download_without_a_movie_match()
        {
            _completedDownload.RemoteMovie = null;

            Subject.Execute(new ProcessMonitoredDownloadsCommand
            {
                RescanCompletedDownloads = true
            });

            Mocker.GetMock<ICompletedDownloadService>()
                  .Verify(v => v.Import(It.IsAny<TrackedDownload>()), Times.Never());
        }

        [Test]
        public void should_not_rescan_a_completed_download_without_an_explicit_rescan_request()
        {
            Subject.Execute(new ProcessMonitoredDownloadsCommand());

            Mocker.GetMock<ICompletedDownloadService>()
                  .Verify(v => v.Import(It.IsAny<TrackedDownload>()), Times.Never());
        }
    }
}
