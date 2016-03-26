using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

using TTTD_DataReaderWriter;


namespace TTTD_Sanitizer
{
    public static class ReaderWriterManager
    {
        #region MEMBER FIELDS

        static Assembly m_assembly = null;
        static Type m_readerType,
                    m_writerType;
        static dynamic m_reader,
                       m_writer;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public static void LoadDLL(string fileName)
        {
            if (File.Exists(fileName))
            {
                m_assembly = Assembly.LoadFile(fileName);
                var types = m_assembly.GetExportedTypes();
                m_readerType = types.FirstOrDefault(x => x.GetInterface(typeof(IReader).Name) != null);
                m_writerType = types.FirstOrDefault(x => x.GetInterface(typeof(IWriter).Name) != null);
                if (m_readerType != null && m_writerType != null)
                {
                    m_reader = Activator.CreateInstance(m_readerType);
                    m_writer = Activator.CreateInstance(m_writerType);
                }
            }
        }

        public static IEnumerable<T> ReadBuilderData<T>(DataStorePassThrough dataStoreSelector, string directory)
        {
            var r = (m_reader != null) ? m_reader.Read<T>(dataStoreSelector, directory) : null;
            return r;
        }

        public static void WriteSanitizerData<T>(IEnumerable<T> objectsToWrite, DataStorePassThrough dataStoreSelector, string directory)
        {
            if (m_writer != null)
            {
                m_writer.Write<T>(objectsToWrite, dataStoreSelector, directory);
            }
        }

        #endregion


        #region Private Functionality
        #endregion

        #endregion
    }
}

