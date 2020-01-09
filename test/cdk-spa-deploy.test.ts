import { expect as expectCDK, haveResource, haveResourceLike } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { SPADeploy } from '../lib/';

test('Cloudfront Distribution Included', () => {
    let stack = new Stack();
    // WHEN
    let deploy = new SPADeploy(stack, 'spaDeploy');
    
    deploy.createSiteWithCloudfront({
      indexDoc: 'index.html',
      websiteFolder: 'website'
    })
    // THEN
    expectCDK(stack).to(haveResource('AWS::S3::Bucket', {
      WebsiteConfiguration: {
        IndexDocument: 'index.html'
      }
    }));
    
    expectCDK(stack).to(haveResource('Custom::CDKBucketDeployment'));
    
    expectCDK(stack).to(haveResourceLike('AWS::CloudFront::Distribution', {
      "DistributionConfig": {
          "CustomErrorResponses": [
            {
              "ErrorCode": 403,
              "ResponseCode": 200,
              "ResponsePagePath": "/index.html"
            },
            {
              "ErrorCode": 404,
              "ResponseCode": 200,
              "ResponsePagePath": "/index.html"
            }
          ],
          "DefaultCacheBehavior": {
                "ViewerProtocolPolicy": "redirect-to-https"
          },
          "DefaultRootObject": "index.html",
          "HttpVersion": "http2",
          "IPV6Enabled": true,
          "PriceClass": "PriceClass_100",
          "ViewerCertificate": {
            "CloudFrontDefaultCertificate": true
          }
      }
    }));
    
    expectCDK(stack).to(haveResourceLike('AWS::S3::BucketPolicy',  {
            PolicyDocument: {
                Statement: [
                    {
                        "Action": "s3:GetObject",
                        "Effect": "Allow",
                        "Principal": "*"
                    }]
            }
    }));
});

test('Basic Site Setup', () => {
    let stack = new Stack();
    
    // WHEN
    let deploy = new SPADeploy(stack, 'spaDeploy');
    
    deploy.createBasicSite({
      indexDoc: 'index.html',
      websiteFolder: 'website'
    })
    
    // THEN
    expectCDK(stack).to(haveResource('AWS::S3::Bucket', {
      WebsiteConfiguration: {
        IndexDocument: 'index.html'
      }
    }));
    
    expectCDK(stack).to(haveResource('Custom::CDKBucketDeployment'));
    
    expectCDK(stack).to(haveResourceLike('AWS::S3::BucketPolicy',  {
            PolicyDocument: {
                Statement: [
                    {
                        "Action": "s3:GetObject",
                        "Effect": "Allow",
                        "Principal": "*"
                    }]
            }
    }));
});
