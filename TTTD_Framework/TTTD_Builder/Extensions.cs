using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Dynamic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

using Newtonsoft.Json;


namespace TTTD_Builder
{
    public static class Extensions
    {
        public static void AddRange<T>(this ObservableCollection<T> observableCollection, IEnumerable<T> range)
        {
            foreach (var obj in range)
                observableCollection.Add(obj);
        }

        public static void RemoveRange<T>(this ObservableCollection<T> observableCollection, IEnumerable<T> range)
        {
            foreach (var obj in range)
                observableCollection.Remove(obj);
        }

        public static void SetGridRowColumn(this Grid grid, UIElement element, int row, int column)
        {
            Grid.SetRow(element, row);
            Grid.SetColumn(element, column);
            grid.Children.Add(element);
        }

        public static string ToPascalCase(this string s)
        {
            if (string.IsNullOrEmpty(s) || !char.IsLower(s[0]))
                return s;

            string str = char.ToUpper(s[0], CultureInfo.InvariantCulture).ToString((IFormatProvider)CultureInfo.InvariantCulture);

            if (s.Length > 1)
                str = str + s.Substring(1);

            return str;
        }
    }

    public class CamelCaseToPascalCaseExpandoObjectConverter : JsonConverter
    {
        internal static bool IsPrimitiveToken(JsonToken token)
        {
            switch (token)
            {
                case JsonToken.Integer:
                case JsonToken.Float:
                case JsonToken.String:
                case JsonToken.Boolean:
                case JsonToken.Null:
                case JsonToken.Undefined:
                case JsonToken.Date:
                case JsonToken.Bytes:
                    return true;
                default:
                    return false;
            }
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            // can write is set to false
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            return ReadValue(reader);
        }

        private object ReadValue(JsonReader reader)
        {
            while (reader.TokenType == JsonToken.Comment)
            {
                if (!reader.Read())
                    throw new JsonException();
            }

            switch (reader.TokenType)
            {
                case JsonToken.StartObject: return ReadObject(reader);
                case JsonToken.StartArray: return ReadList(reader);
                default:
                    if (IsPrimitiveToken(reader.TokenType))
                        return reader.Value;

                    throw new JsonException(string.Format(CultureInfo.InvariantCulture, "Unexpected token when converting ExpandoObject: {0}", reader.TokenType));
            }
        }

        private object ReadList(JsonReader reader)
        {
            IList<object> list = new List<object>();

            while (reader.Read())
            {
                switch (reader.TokenType)
                {
                    case JsonToken.Comment:
                        break;
                    default:
                        object v = ReadValue(reader);

                        list.Add(v);
                        break;
                    case JsonToken.EndArray:
                        return list;
                }
            }

            throw new JsonException();
        }

        private object ReadObject(JsonReader reader)
        {
            IDictionary<string, object> expandoObject = new ExpandoObject();

            while (reader.Read())
            {
                switch (reader.TokenType)
                {
                    case JsonToken.PropertyName:  
                        string propertyName = reader.Value.ToString().ToPascalCase();

                        if (!reader.Read())
                            throw new JsonException();

                        object v = ReadValue(reader);

                        expandoObject[propertyName] = v;
                        break;
                    case JsonToken.Comment:
                        break;
                    case JsonToken.EndObject:
                        return expandoObject;
                }
            }

            throw new JsonException();
        }

        public override bool CanConvert(Type objectType)
        {
            return (objectType == typeof(ExpandoObject));
        }

        public override bool CanWrite
        {
            get { return false; }
        }
    }
}
