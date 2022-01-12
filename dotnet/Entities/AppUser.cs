namespace dotnet.Entities
{
    public class AppUser
    {
        public int id { get; set; }
        public string UserName { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }

        public byte[] passwordHash { get; set; }
        public byte[] passwordSalt { get; set; }
    }
}