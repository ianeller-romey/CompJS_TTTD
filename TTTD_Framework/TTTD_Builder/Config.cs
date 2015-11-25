using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;


namespace TTTD_Builder
{
    public static class Config
    {
        #region MEMBER FIELDS

        static readonly string s_documentsPath = Path.Combine(System.Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), System.Reflection.Assembly.GetExecutingAssembly().GetName().Name);
        static readonly string s_configFileName = Path.ChangeExtension(typeof(Config).Name, ".xml");
        static Configuration s_configuration = new Configuration();

        #endregion


        #region MEMBER PROPERTIES

        public static string ConfigFile { get { return Path.Combine(s_documentsPath, s_configFileName); } }

        public static string ReaderWriterDll
        {
            get { return s_configuration.ReaderWriterDll; }
            set { s_configuration.ReaderWriterDll = value; }
        }

        public static string DataDirectory
        {
            get { return s_configuration.DataDirectory; }
            set { s_configuration.DataDirectory = value; }
        }

        #endregion


        #region MEMBER CLASSES

        [XmlRoot("Configuration")]
        public class Configuration
        {
            #region MEMBER PROPERTIES
            
            [XmlElement("ReaderWriterDll")]
            public string ReaderWriterDll { get; set; }

            [XmlElement("DataDirectory")]
            public string DataDirectory { get; set; }

            #endregion
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public static void Serialize()
        {
            if (!Directory.Exists(s_documentsPath))
                Directory.CreateDirectory(s_documentsPath);

            XmlSerializer serializer = new XmlSerializer(typeof(Configuration));
            using (var writer = new StreamWriter(ConfigFile, false))
            {
                serializer.Serialize(writer, s_configuration);
            }
        }

        public static void Deserialize()
        {
            if (!Directory.Exists(s_documentsPath))
                Directory.CreateDirectory(s_documentsPath);

            if (!File.Exists(ConfigFile))
                return;

            XmlSerializer serializer = new XmlSerializer(typeof(Configuration));
            using (var reader = new StreamReader(ConfigFile))
            {
                var o = serializer.Deserialize(reader);
                s_configuration = o as Configuration;
            }
        }

        #endregion


        #region Private Functionality
        #endregion

        #endregion
    }
}
