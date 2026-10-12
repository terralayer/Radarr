using NzbDrone.Core.Messaging.Commands;

namespace NzbDrone.Core.Download
{
    public class RefreshMonitoredDownloadsCommand : Command
    {
        public bool RescanCompletedDownloads { get; set; }
    }
}
