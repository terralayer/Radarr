using System.Collections.Generic;
using Moq;
using NUnit.Framework;
using NzbDrone.Core.Download;
using NzbDrone.Core.Download.TrackedDownloads;
using NzbDrone.Core.Messaging.Commands;
using NzbDrone.Core.Test.Framework;
using NzbDrone.Test.Common;

namespace NzbDrone.Core.Test.Download.TrackedDownloads
{
    [TestFixture]
    public class DownloadMonitoringServiceFixture : CoreTest<DownloadMonitoringService>
    {
        [SetUp]
        public void Setup()
        {
            Mocker.GetMock<IDownloadClientFactory>()
                  .Setup(v => v.DownloadHandlingEnabled(It.IsAny<bool>()))
                  .Returns(new List<IDownloadClient>());
        }

        [Test]
        public void should_request_a_completed_download_rescan_when_refresh_requests_a_rescan()
        {
            Subject.Execute(new RefreshMonitoredDownloadsCommand
            {
                RescanCompletedDownloads = true
            });

            Mocker.GetMock<IManageCommandQueue>()
                  .Verify(v => v.Push(
                      It.Is<ProcessMonitoredDownloadsCommand>(command => command.RescanCompletedDownloads),
                      CommandPriority.High,
                      It.IsAny<CommandTrigger>()),
                      Times.Once());
        }

        [Test]
        public void should_not_request_a_completed_download_rescan_for_an_ordinary_refresh()
        {
            Subject.Execute(new RefreshMonitoredDownloadsCommand());

            Mocker.GetMock<IManageCommandQueue>()
                  .Verify(v => v.Push(
                      It.Is<ProcessMonitoredDownloadsCommand>(command => command.RescanCompletedDownloads),
                      It.IsAny<CommandPriority>(),
                      It.IsAny<CommandTrigger>()),
                      Times.Never());
        }
    }
}
