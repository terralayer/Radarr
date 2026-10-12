using NzbDrone.Core.Messaging.Commands;

namespace NzbDrone.Core.Download
{
    public class ProcessMonitoredDownloadsCommand : Command
    {
        public bool RescanCompletedDownloads { get; set; }

        public override bool RequiresDiskAccess => true;

        public override bool IsLongRunning => true;
    }
}
