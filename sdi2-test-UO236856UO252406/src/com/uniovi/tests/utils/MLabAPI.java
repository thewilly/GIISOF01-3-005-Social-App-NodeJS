package com.uniovi.tests.utils;

import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 *
 * @author Guillermo Facundo Colunga
 * @version 201806060418
 * @since 201806060418
 * @formatter Oviedo Computing Community
 */
public class MLabAPI {

	private static final String API_BASE_URL = "https://api.mlab.com/api/1";
	private static final String API_KEY = "";

	/**
	 * From a given database name will remove the given collection.
	 * 
	 * @param databaseName is the name of the database where the collection is.
	 * @param collectionName is the name of the collection to remove from the given database.
	 */
	static public void removeCollection( String databaseName, String collectionName ) {
		try {
			String url = API_BASE_URL + "/databases/" + databaseName + "/collections/"
					+ collectionName
					+ "?apiKey=" + API_KEY;
			String data = "[]";

			URL obj = new URL( url );
			HttpURLConnection conn = (HttpURLConnection) obj.openConnection();

			conn.setRequestProperty( "Content-Type", "application/json" );
			conn.setDoOutput( true );

			conn.setRequestMethod( "PUT" );

			OutputStreamWriter out = new OutputStreamWriter( conn.getOutputStream() );

			out.write( data );
			out.close();

			new InputStreamReader( conn.getInputStream() );
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
