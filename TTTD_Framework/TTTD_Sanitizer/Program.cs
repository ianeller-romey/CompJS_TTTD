using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using AutoMapper;

using Newtonsoft.Json;

using BData = TTTD_Builder.Lib.Data;
using SData = TTTD_Sanitizer.Lib.Data;


namespace TTTD_Sanitizer
{
    class Program
    {
        static void Main(string[] args)
        {
            if(args.Length != 3)
            {
                Console.Write("Please specify an input directory, an output directory, and a DataReaderWriter.dll file.");
            }

            var inputDirectory = Path.GetFullPath(args[0]);
            var outputDirectory = Path.GetFullPath(args[1]);
            var dataReaderWriterDll = Path.GetFullPath(args[2]);

            ReaderWriterManager.LoadDLL(dataReaderWriterDll);
            DataManager.LoadBuilderData(inputDirectory);
            DataManager.SanitizeBuilderData(outputDirectory);
        }

    }
}
