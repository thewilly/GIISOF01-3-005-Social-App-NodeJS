/*
 * This source file is part of the NotaneitorTests open source project.
 *
 * Copyright (c) 2018 willy and the NotaneitorTests project authors.
 * Licensed under GNU General Public License v3.0.
 *
 * See /LICENSE for license information.
 * 
 */
package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

/**
 * Instance of PO_LoginView.java
 * 
 * @author
 * @version
 */
public class PO_UsersView extends PO_NavView {


	/**
	 * 
	 * @param driver
	 * @param texto
	 */
	public static void fillForm(WebDriver driver, String texto) {
		// Enter the user name field.
		WebElement userField = driver.findElement(By.id("filtro-nombre"));
		userField.click();
		userField.clear();
		userField.sendKeys(texto);

	}

	/**
	 * 
	 * @param driver
	 * @param string
	 */
	public static void sendMessage(WebDriver driver, String string) {
		WebElement userField = driver.findElement(By.id("mensajeTexto"));
		userField.click();
		userField.clear();
		userField.sendKeys(string);
	}
	

}