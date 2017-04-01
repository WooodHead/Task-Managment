package com.citrix.xenauto.component.xms.rest.testcases.configure.policies;

import java.util.Iterator;

import org.apache.commons.httpclient.HttpStatus;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.citrix.xenauto.cache.ModuleCacheConstants;
import com.citrix.xenauto.common.DataKeys;
import com.citrix.xenauto.component.xdm.console.helper.GenericHelper;
import com.citrix.xenauto.component.xdm.rest.cache.Session;
import com.citrix.xenauto.component.xdm.rest.cache.SessionCache;
import com.citrix.xenauto.component.xdm.rest.common.RestValidationAction;
import com.citrix.xenauto.component.xdm.rest.common.WSRestResponse;
import com.citrix.xenauto.component.xms.config.XMSConfig;
import com.citrix.xenauto.component.xms.config.XMSUrlConstants;
import com.citrix.xenauto.component.xms.rest.cache.ObjectCache;
import com.citrix.xenauto.framework.core.cache.ModuleCommonCache;
import com.citrix.xenauto.framework.core.scenario.testcase.HttpRequestHandler;
import com.citrix.xenauto.framework.core.scenario.testcase.RestContent;
import com.citrix.xenauto.framework.core.scenario.testcase.RestRequest;
import com.citrix.xenauto.framework.core.scenario.testcase.RestResponse;
import com.citrix.xenauto.framework.core.scenario.testcase.RestTestCase;
import com.citrix.xenauto.framework.core.util.fileutil.DataFileUtil;
import com.citrix.xenauto.util.JSONDataUtil;
import com.citrix.xenauto.util.WebServicesHelper;

public class WSRestXMSConsolePutPolicies extends RestTestCase {
	
	@Override
	public boolean runIt() throws Exception {
	
		RestRequest request = new RestRequest();
		Session session = SessionCache.getSession(TestCaseData.get(DataKeys.SessionID));
		
		request.setUrl(getUrl());
		request.setRestContent(getContent());
		request.setHeaders(XMSConfig.getHeaders(session.getSession()));
		
		HttpRequestHandler httpRequestHandler = new HttpRequestHandler();
		RestResponse response = httpRequestHandler.doPut(this.getClass().getName(), request, true, this.scenarioLogger);
		
		return validate(response);
	}
	
	@Override
	public RestContent getDocumentContent() throws Exception {
		JSONObject jsonData = new JSONObject(documentData);
		String policyName = jsonData.optString(DataKeys.name);
		String modulePath = ModuleCacheConstants.DEVICE_POLICIES;
		String policyId = getPolicyIdFromModuleCache();
		
		jsonData.put(DataKeys.id, policyId);
		JSONArray platformsArray = jsonData.optJSONArray(DataKeys.platforms);
		
		for (int i = 0; i < platformsArray.length(); i++) {
			JSONObject platformObj = platformsArray.getJSONObject(i);
			String os = platformObj.optString(DataKeys.platform);
			
			String platformId = (String) ModuleCommonCache.getCachedModuleObject(modulePath + "-" + os, policyName);
			platformObj.put(DataKeys.id, platformId);
			String hiveId = platformObj.optString(DataKeys.hiveId);
			
			if(hiveId != null && !hiveId.isEmpty()) {
				platformObj.put(DataKeys.hiveId, platformId);
			}
			
			String rules = platformObj.optString(DataKeys.rules);
			String decomRules = platformObj.optString(DataKeys.decomposedRules);
			
			if(rules != null && !rules.isEmpty()) {
				JSONObject ruleObj = new JSONObject(rules);
				platformObj.put(DataKeys.rules, ruleObj);
			}
			if(decomRules != null && !decomRules.isEmpty()) {
				JSONObject ruleObj = new JSONObject(decomRules);
				platformObj.put(DataKeys.decomposedRules, ruleObj);
			}
			updateFileUploadDataIfRequired(platformObj);
		}
		String contentToPost = jsonData.toString();
		//System.out.println(contentToPost);
		return new RestContent(contentToPost);
	}
	
	private void updateFileUploadDataIfRequired(JSONObject platformObj) throws JSONException {
		String importFile = platformObj.optString("importCertificateFile_original");
		if(importFile.isEmpty()) {
			return;
		}
		String modulePath = ModuleCacheConstants.DEVICE_POLICIES;
		
		String platform = platformObj.optString(DataKeys.platform);
		JSONObject fileObj = ModuleCommonCache.getElement(modulePath + "-" + platform, importFile);
		String fileId = fileObj.optString(DataKeys.id);
		String fileExt = DataFileUtil.getResourceExtension(importFile);
		
		platformObj.put("importCertificateFile", fileId + fileExt);
	}
	
	@Override
	public RestContent getMapContent() throws Exception {
		JSONObject policyFields = (JSONObject) ObjectCache.getObject(TestCaseData.get(DataKeys.PolicyName));
		String id = ObjectCache.getID(TestCaseData.get(DataKeys.PolicyName));
		
		String result = getRequestContent(policyFields, id);
		return new RestContent(result);
	}
	
	@Override
	public boolean validateMapResp(RestResponse wsResponse) throws Exception {
		
		boolean status = false;
		int statusCode = Integer.parseInt(TestCaseData.get(DataKeys.StatusCode));
		String responseValue = TestCaseData.get(DataKeys.ResponseValue);
		String message = TestCaseData.get(DataKeys.Message);
		String validationAction = TestCaseData.get(DataKeys.Validation);

		if(wsResponse.getStatus() == statusCode && statusCode == HttpStatus.SC_OK){
			boolean searchResult = responseValue.equals(wsResponse.getJsonResponse().get(DataKeys.status).toString());
			if(searchResult && validationAction.equals(RestValidationAction.UPDATE)){
				statusMsg += message;
				status = true;
			}else if(!searchResult && validationAction.equals(RestValidationAction.NOT_FOUND)){
				statusMsg += message;
				status = true;
			}else{
				statusMsg = "[TestCase Failed]::[Status Code:: "+ wsResponse.getStatus()+"] [FaultString :: "+wsResponse.getJsonResponse().get(DataKeys.message)+"]";
			}
		} else {
			
			statusMsg = "[TestCase Failed]::[Status Code:: "+ wsResponse.getStatus()+"] [FaultString :: "+wsResponse.getJsonResponse().get(DataKeys.message)+"]";
		}

		return status;
	}
	
	public String getUrl() throws Exception {
		String id = "";
		if(isDocumentDataAvailable) {
			id = getPolicyIdFromModuleCache();
		}
		else {
			id = ObjectCache.getID(TestCaseData.get(DataKeys.PolicyName));
		}
		String url = XMSUrlConstants.XMSURL+XMSUrlConstants.XMSControlPoint+XMSUrlConstants.XMSXDMServices+XMSUrlConstants.XMSDevicePolicy+"/"+id;
		return url;
	}
	
	private String getPolicyIdFromModuleCache() throws JSONException {
		JSONObject jsonData = new JSONObject(documentData);

		String policyName = jsonData.optString(DataKeys.name);
		
		String modulePath = ModuleCacheConstants.DEVICE_POLICIES;
		JSONObject policy = (JSONObject) ModuleCommonCache.getCachedModuleObject(modulePath, policyName);
		String id = policy.optString(DataKeys.id);
		
		return id;
	}
//	@Override
//	public boolean runIt(IProcessWrapper pProcessDriver) throws Exception {
//
//		JSONObject policyFields=(JSONObject) ObjectCache.getObject(TestCaseData.get(DataKeys.PolicyName));
//		Session session=SessionCache.getSession(TestCaseData.get(DataKeys.SessionID));
//		String id=ObjectCache.getID(TestCaseData.get(DataKeys.PolicyName));
//		String URL=WSXMSConstants.XMSControlPoint+WSXMSConstants.XMSXDMServices+WSXMSConstants.XMSDevicePolicy+"/"+id;
//		ObjWadlProjectWrapper wadlProjManager = ObjWadlProjectWrapper.Initialize((WsdlProject)pProcessDriver.Get(), WSRestConstants.componentTestSuite, TestCaseData.get(DataKeys.TestStepName), XMSUrlConstants.RESTURL);
//		ObjRestTestStepWrapper testStepManager = ObjRestTestStepWrapper.Initialize(wadlProjManager,URL,RestRequestInterface.HttpMethod.PUT);
//		testStepManager.getRestRequest().setRequestHeaders(WebServicesHelper.setRequest(session,WSXMSConstants.referer));
//		testStepManager.getRestRequest().setRequestContent(getRequestContent(policyFields,id));
//		testStepManager.getRestRequest().setMediaType(MediaType.JSON_UTF_8.toString());
//		WSRestResponse testResponse = RestWebServiceCalls.runRestOperation(testStepManager, scenarioLogger);
//		boolean lIsSuccessful= validateResponse(testResponse);
//
//		return lIsSuccessful;
//	}
//
//	public boolean validateResponse(WSRestResponse wsResponse) throws Exception{
//
//		boolean status = false;
//		int statusCode = Integer.parseInt(TestCaseData.get(DataKeys.StatusCode));
//		String responseValue = TestCaseData.get(DataKeys.ResponseValue);
//		String message = TestCaseData.get(DataKeys.Message);
//		String validationAction = TestCaseData.get(DataKeys.Validation);
//
//		if(wsResponse.getHttpStatusCode()==statusCode && statusCode == HttpStatus.SC_OK){
//			boolean searchResult = responseValue.equals(wsResponse.getJsonResponse().get(DataKeys.status).toString());
//			if(searchResult && validationAction.equals(RestValidationAction.UPDATE)){
//				statusMsg = message;
//				status = true;
//			}else if(!searchResult && validationAction.equals(RestValidationAction.NOT_FOUND)){
//				statusMsg = message;
//				status = true;
//			}else{
//				statusMsg = "[TestCase Failed]::[Status Code:: "+ wsResponse.getHttpStatusCode()+"] [FaultString :: "+wsResponse.getJsonResponse().get(DataKeys.message)+"]";
//			}
//		} else {
//			
//			statusMsg = "[TestCase Failed]::[Status Code:: "+ wsResponse.getHttpStatusCode()+"] [FaultString :: "+wsResponse.getJsonResponse().get(DataKeys.message)+"]";
//		}
//
//		return status;
//
//	}


	private String getRequestContent(JSONObject policyJsonStructure, String id) throws Exception{

		JSONArray reqPlatformsArray=new JSONArray();

		// Iterate over all platforms and configure/sent policy request for platforms mentioned in data file (PolicyPlatforms)
		JSONArray platforms =policyJsonStructure.getJSONArray(DataKeys.platforms);
		
		for(int index=0; index<platforms.length(); index++)	{

			JSONObject cachedPlatform = platforms.getJSONObject(index);
			String platformlabl = cachedPlatform.getString(DataKeys.platform);

			// If data file contains this platform, then create configuration for this platform.
			if(TestCaseData.get(DataKeys.PolicyPlatforms).contains(platformlabl)) {

				JSONObject reqplatform = new JSONObject();

				Iterator<?> keyIterator=cachedPlatform.keys();
				while(keyIterator.hasNext()){

					String key = (String)keyIterator.next();
					if(key.equals(DataKeys.platform)){
						JSONDataUtil.put(reqplatform, key, platformlabl);
					}
					else if(key.equals("fileId")) {
						JSONDataUtil.put(reqplatform, key, getPlatformId());
					}else if(key.equals("id")){
						JSONDataUtil.put(reqplatform, key,getPlatformId());
						
					}else if(key.equals("hiveId")){
						JSONDataUtil.put(reqplatform, key,getPlatformId());
						
					}else if(key.equalsIgnoreCase("credentialProvId")){
						if(!TestCaseData.get(key).equalsIgnoreCase("-1")){
							JSONDataUtil.put(reqplatform, key, ObjectCache.getObjJson(TestCaseData.get(key)).getString("id"));
						}
					}else if(key.equalsIgnoreCase("caCertId")){
						if(!TestCaseData.get(key).equalsIgnoreCase("-1")){
							JSONDataUtil.put(reqplatform, key, ObjectCache.getObjJson(TestCaseData.get(key)).getString("id"));
						}
					}
					else {
						JSONDataUtil.put(reqplatform, key, TestCaseData.get(key));
					}
				}
			
				if(TestCaseData.get(DataKeys.rules).isEmpty() || TestCaseData.get(DataKeys.DeviceCondition).isEmpty())
				{	
					reqplatform.put(DataKeys.rules, "");
				}
				else
				{
					reqplatform.put(DataKeys.rules, getDeviceRulesObject().get(0));
				}
					reqPlatformsArray.put(reqplatform);
			}	
		}

		JSONObject schedule =WebServicesHelper.getSchedule(TestCaseData);
		JSONObject request = new JSONObject();
		JSONArray roles=new JSONArray();

		request.put(DataKeys.name, TestCaseData.get(DataKeys.PolicyName));
		request.put(DataKeys.description, TestCaseData.get(DataKeys.description));
		request.put(DataKeys.platforms, reqPlatformsArray);
		request.put(DataKeys.schedule,schedule);
		request.put(DataKeys.resourceType,TestCaseData.get(DataKeys.resourceType));
		//request.put(DataKeys.roles,roles.put(TestCaseData.get(DataKeys.roles)));
		if(!TestCaseData.get(DataKeys.roles).isEmpty())
		   {
		    request.put(DataKeys.roles,roles.put(TestCaseData.get(DataKeys.roles)));
		   }
		   else
		   {
		    request.put(DataKeys.roles, new JSONArray());
		   }
		request.put(DataKeys.id, id);
		System.out.println(request.toString());
		return request.toString();
	}
	
	private String getPlatformId() throws JSONException, Exception {
		String platformId = "";
		RestResponse restResponse = (RestResponse) ModuleCommonCache.getCachedModuleObject(ModuleCacheConstants.DEVICE_POLICIES, TestCaseData.get(DataKeys.PolicyName));
		if (restResponse!=null){
			JSONArray jArray = restResponse.getJsonResponse().getJSONArray("platforms");
			for(int i=0;i<jArray.length();i++){
				JSONObject jObj = jArray.getJSONObject(i);
				if(jObj.getString("platform").equalsIgnoreCase(TestCaseData.get(DataKeys.platform))){
					platformId = jObj.getString("id");
					break;
				}
			}
		}
		return platformId;
}

	private JSONArray getDeviceRulesObject() throws JSONException{

		String[] lRulesArray = TestCaseData.get(DataKeys.rules).split(";");
		JSONArray jArray = new JSONArray();
		JSONObject jObj = new JSONObject();

		int counter = 0;
		int a = 0;

		for (String lSingleRule: lRulesArray){

			String[] lSingleRuleVals = lSingleRule.split(",");

			for (int i=0;i<lSingleRuleVals.length;){

				JSONObject jCondObj = new JSONObject();
				JSONObject jPropObj = new JSONObject();
				jObj = new JSONObject();

				jPropObj.put(DataKeys.type,lSingleRuleVals[i+1] );
				jPropObj.put(DataKeys.name, lSingleRuleVals[i+2]);

				jCondObj.put(DataKeys.property, jPropObj);
				jCondObj.put(DataKeys.type, lSingleRuleVals[i+3]);
				jCondObj.put(DataKeys.value, lSingleRuleVals[i+4]);
				jObj.put(GenericHelper.getCondition(lSingleRuleVals[i]), jCondObj);
				break;
			}


			jArray.put(counter, jObj);	
			counter++;	
		}
	
		JSONObject rulesObj = new JSONObject();
		rulesObj.put(TestCaseData.get(DataKeys.DeviceCondition), jArray);
			
		
	//	JSONObject jObjFinal = new JSONObject();
		
	//	jObjFinal.put(TestCaseData.get(DataKeys.OSFamily), rulesObj.toString());		
		
		JSONArray rulesArr = new JSONArray();
		rulesArr.put(a, rulesObj.toString());
				
		return rulesArr;
	}
	
}

